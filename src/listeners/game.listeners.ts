import {eventEmitter} from "../app";
import {FastifyInstance} from "fastify";
import {
    getAiNeeds,
    getMatchById,
    getMatchData,
    getPlayerData,
    // gettainingData,
    movePaddle,
    togglePauseMatch
} from "../services/match.service";
import Match from "../classes/Match";

import { clearInterval } from "timers";
import {env} from "../utils/environment";
import { SendAllowed } from "../classes/Ball";
// import { SendAllowed } from "../classes/Ball";
// import {env} from "../utils/environment";
// import {env} from "../utils/environment";
// import {log} from "node:util";
// import {ApiError, ApiErrorCode} from "../utils/error.util";

export function registerGameListeners(_app: FastifyInstance): void {

    eventEmitter.on("ws-message:move-paddle", (data: any, socket: WebSocket) => {
        if (data && typeof data === "object") {
            if (typeof data["user_id"] === "number") {
                if (data["direction"] && (data["direction"] === "up" || data["direction"] === "down")) {

                    socket.send(JSON.stringify(movePaddle(data["user_id"], data["direction"])));
                }
                else {
                    socket.send(JSON.stringify({success: false, message: "Invalid direction"}));
                    // throw new ApiError(ApiErrorCode.INVALID_REQUEST_BODY, "Invalid direction");
                }
            }
            else {
                socket.send(JSON.stringify({success: false, message: "Missing user_id"}));
                // throw new ApiError(ApiErrorCode.INVALID_REQUEST_BODY, "Missing user_id");
            }
        }
        else {
            socket.send(JSON.stringify({success: false, message: "Invalid data format"}));
            // throw new ApiError(ApiErrorCode.INVALID_REQUEST_BODY, "Invalid data format");
        }
    });

    eventEmitter.on("ws-message:get-player-data", (data: any, socket: WebSocket) => {
        if (data && typeof data === "object") {
            if (typeof data["user_id"] === "number") {
                socket.send(JSON.stringify(getPlayerData(data["user_id"])));
            }
            else {
                socket.send(JSON.stringify({success: false, message: "Missing user_id"}));
                // throw new ApiError(ApiErrorCode.INVALID_REQUEST_BODY, "Missing user_id");
            }
        }
        else {
            socket.send(JSON.stringify({success: false, message: "Invalid data format"}));
            // throw new ApiError(ApiErrorCode.INVALID_REQUEST_BODY, "Invalid data format");
        }
    });

    const matchIntervalManager: Map<number, NodeJS.Timeout> = new Map();
    eventEmitter.on("ws-message:get-match-data", (data: any, socket: WebSocket) => {
        let match :Match | null;

        if (data && typeof data === "object") {
            // console.log("                               get-match-data", data && typeof data["match_id"]);
            if (typeof data["match_id"] === "number") {
                if (!getMatchById(data["match_id"])) {
                    socket.send(JSON.stringify({success: false, message: "Missing match is null"}));
                    console.log(`Attempt to draw invalid match with id: ${data["match_id"]}`);
                    return;
                    // throw new ApiError(ApiErrorCode.MATCH_NOT_FOUND, "Match not found");
                }
                if (matchIntervalManager.has(data["match_id"])) {
                    clearInterval(matchIntervalManager.get(data["match_id"])!);
                    matchIntervalManager.delete(data["match_id"]);
                }
                const matchInterval: NodeJS.Timeout = setInterval(async () =>{
                    matchIntervalManager.set(data["match_id"], matchInterval);
                    match = getMatchById(data["match_id"]);
                    if (match)
                        await matchLoopView(match.match_id, socket)
                    else {
                        clearInterval(matchIntervalManager.get(data["match_id"])!);
                        matchIntervalManager.delete(data["match_id"]);
                    }
                }, 17)   
                
            }
            else {
                socket.send(JSON.stringify({success: false, message: "Missing match_id"}));
                // throw new ApiError(ApiErrorCode.INVALID_REQUEST_BODY, "Missing match_id");
            }
        }
        else {
            socket.send(JSON.stringify({success: false, message: "Invalid data format"}));
            // throw new ApiError(ApiErrorCode.INVALID_REQUEST_BODY, "Invalid data format");

        }
    })

    function matchLoopView(match_id: number, socket: WebSocket) : Promise<void>
    {
        return new Promise((resolve, _reject) =>{
            socket.send(JSON.stringify(getMatchData(match_id)))
            resolve();
        })
    }


    let intervalManager: NodeJS.Timeout
    eventEmitter.on("ws-message:get-ia-needs-data", (data: any, socket: WebSocket) => {

        if (data && typeof data === "object" ) {
                if (intervalManager) {
                    clearInterval(intervalManager);
                    console.log("Cleared interval for ai needs data");
                }
                intervalManager = setInterval(async () =>{
                    // if (SendAllowed.get()){
                    await SendAiNeedsView(socket);
                    //     console.log("Sent ai needs data");
                    //     SendAllowed.set(false);
                    // }
                }, 1000 / env.TIME_MULTIPLIER);

        }
        else {
            socket.send(JSON.stringify({success: false, message: "Invalid data format"}));
            // throw new ApiError(ApiErrorCode.INVALID_REQUEST_BODY, "Invalid data format");
        }
    })

    function SendAiNeedsView(socket: WebSocket) : Promise<void>
    {
        // console.log("SendAiNeedsView", match_id)
        return new Promise((resolve, reject) =>{
            let payload:string = JSON.stringify(getAiNeeds())
            if (!payload)
                return reject(() => console.log("Error: No payload to send"));

            // console.log("payload", payload)
            socket.send(payload)
            resolve();
        })
    }

    function SendRegistry(socket: WebSocket) : Promise<void>
    {
        // console.log("SendAiNeedsView", match_id)
        return new Promise((resolve, reject) =>{
            let payload:string = JSON.stringify(SendAllowed.get())
            if (!payload || payload === "[]" || payload === null || payload === "null")
                return reject(() => console.log("Error: No payload to send"));
            if (payload){
                console.log("YESSSSSSSSSSSSSSSSS: ", payload)
            }
            // console.log("registry:   ", payload)
            socket.send(payload)
            resolve();
        })
    }


    eventEmitter.on("ws-message:get-score-registry", (data: any, socket: WebSocket) => {

        if (data && typeof data === "object" ) {
            SendRegistry(socket).catch(() => {})
        }
        else {
            socket.send(JSON.stringify({success: false, message: "Invalid data format"}));
            // throw new ApiError(ApiErrorCode.INVALID_REQUEST_BODY, "Invalid data format");
        }
    })

    eventEmitter.on("ws-message:toggle-pause-match", (data: any, socket: WebSocket) => {
        if (data && typeof data === "object") {
            if (typeof data["match_id"] === "number") {
                // socket.send(JSON.stringify({success: true, message: "Match pause is being toggled"}));
                socket.send(JSON.stringify(togglePauseMatch(data["match_id"])));
            }
            else {
                socket.send(JSON.stringify({success: false, message: "Missing match_id"}));
                // throw new ApiError(ApiErrorCode.INVALID_REQUEST_BODY, "Missing match_id");
            }
        }
        else {
            socket.send(JSON.stringify({success: false, message: "Invalid data format"}));
            // throw new ApiError(ApiErrorCode.INVALID_REQUEST_BODY, "Invalid data format");
        }
    })
}