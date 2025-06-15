import {eventEmitter} from "../app";
import {FastifyInstance} from "fastify";
import { getAiNeeds, getMatchById, getMatchData, getPlayerData,  movePaddle, togglePauseMatch} from "../services/match.service";
import Match from "../classes/Match";

import { clearInterval } from "timers";
import {env} from "../utils/environment";
import {ApiError, ApiErrorCode} from "../utils/error.util";

export function registerGameListeners(_app: FastifyInstance): void {

    eventEmitter.on("ws-message:move-paddle", (data: any, socket: WebSocket) => {
        if (data && typeof data === "object") {
            if (typeof data["user_id"] === "number") {
                if (data["direction"] && (data["direction"] === "up" || data["direction"] === "down")) {

                    socket.send(JSON.stringify(movePaddle(data["user_id"], data["direction"])));
                }
                else {
                    // socket.send(JSON.stringify({success: false, message: "Invalid direction"}));
                    throw new ApiError(ApiErrorCode.INVALID_REQUEST_BODY, "Invalid direction");
                }
            }
            else {
                // socket.send(JSON.stringify({success: false, message: "Missing user_id"}));
                throw new ApiError(ApiErrorCode.INVALID_REQUEST_BODY, "Missing user_id");
            }
        }
        else {
            // socket.send(JSON.stringify({success: false, message: "Invalid data format"}));
            throw new ApiError(ApiErrorCode.INVALID_REQUEST_BODY, "Invalid data format");
        }
    });

    eventEmitter.on("ws-message:get-player-data", (data: any, socket: WebSocket) => {
        if (data && typeof data === "object") {
            if (typeof data["user_id"] === "number") {
                socket.send(JSON.stringify(getPlayerData(data["user_id"])));
            }
            else {
                // socket.send(JSON.stringify({success: false, message: "Missing user_id"}));
                throw new ApiError(ApiErrorCode.INVALID_REQUEST_BODY, "Missing user_id");
            }
        }
        else {
            // socket.send(JSON.stringify({success: false, message: "Invalid data format"}));
            throw new ApiError(ApiErrorCode.INVALID_REQUEST_BODY, "Invalid data format");
        }
    });

    const matchIntervalManager: Map<number, NodeJS.Timeout> = new Map();
    eventEmitter.on("ws-message:get-match-data", (data: any, socket: WebSocket) => {
        let match :Match | null;

        if (data && typeof data === "object") {
            // console.log("                               get-match-data", data && typeof data["match_id"]);
            if (typeof data["match_id"] === "number") {
                if (!getMatchById(data["match_id"])) {
                    // socket.send(JSON.stringify({success: false, message: "Missing match is null"}));
                    // console.log(`Attempt to draw invalid match with id: ${data["match_id"]}`);
                    // return;
                    throw new ApiError(ApiErrorCode.MATCH_NOT_FOUND, "Match not found");
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
                // socket.send(JSON.stringify({success: false, message: "Missing match_id"}));
                throw new ApiError(ApiErrorCode.INVALID_REQUEST_BODY, "Missing match_id");
            }
        }
        else {
            // socket.send(JSON.stringify({success: false, message: "Invalid data format"}));
            throw new ApiError(ApiErrorCode.INVALID_REQUEST_BODY, "Invalid data format");

        }
    })

    function matchLoopView(match_id: number, socket: WebSocket) : Promise<void>
    {
        return new Promise((resolve, _reject) =>{
            socket.send(JSON.stringify(getMatchData(match_id)))
            resolve();
        })
    }

    let time_between_updates = Date.now();
    let last_ping:number = 0;
    const intervalManager: Map<number, NodeJS.Timeout> = new Map();
    eventEmitter.on("ws-message:get-ia-needs-data", (data: any, socket: WebSocket) => {
        let match :Match | null;

        if (data && typeof data === "object" ) {
            if (typeof data["match_id"] === "number" ) {
                if (intervalManager.has(data["match_id"])) {
                    clearInterval(intervalManager.get(data["match_id"])!);
                    intervalManager.delete(data["match_id"]);
                    console.log("Cleared interval for match_id:", data["match_id"]);
                }
                const interval:NodeJS.Timeout = setInterval(async () =>{
                    intervalManager.set(data["match_id"], interval);
                    match = getMatchById(data["match_id"]);
                    if (match && match.isRunning){
                        await SendAiNeedsView(match.match_id, socket)
                    }

                }, 1000 / env.TIME_MULTIPLIER)
            }
            else if (typeof data["match_id"] != "number"){
                // socket.send(JSON.stringify({success: false, message: "Missing match_id"}));
                throw new ApiError(ApiErrorCode.INVALID_REQUEST_BODY, "Missing match_id");
            }
            else if (intervalManager.has(data["match_id"])) {
                // socket.send(JSON.stringify({success: false, message: "Already listening to this match"}));
                throw new ApiError(ApiErrorCode.RESOURCE_ALREADY_EXISTS, "Already listening to this match");
            }
        }
        else {
            // socket.send(JSON.stringify({success: false, message: "Invalid data format"}));
            throw new ApiError(ApiErrorCode.INVALID_REQUEST_BODY, "Invalid data format");
        }
    })

    function SendAiNeedsView(match_id: number, socket: WebSocket) : Promise<void>
    {
        // console.log("SendAiNeedsView", match_id)
        return new Promise((resolve, _reject) =>{
            const ping:number = Date.now() - time_between_updates;
            if (ping !== last_ping && ping !== last_ping + 1 && ping !== last_ping - 1) {
                // console.log("time between updates: ", ping)
                last_ping = ping;
            }
            const payload = JSON.stringify(getAiNeeds(match_id))
            if (!payload)
                return resolve();
            // console.log("payload", payload)
            socket.send(payload)
            time_between_updates = Date.now();
            resolve();
        })
    }

    eventEmitter.on("ws-message:toggle-pause-match", (data: any, socket: WebSocket) => {
        if (data && typeof data === "object") {
            if (typeof data["match_id"] === "number") {
                // socket.send(JSON.stringify({success: true, message: "Match pause is being toggled"}));
                socket.send(JSON.stringify(togglePauseMatch(data["match_id"])));
            }
            else {
                // socket.send(JSON.stringify({success: false, message: "Missing match_id"}));
                throw new ApiError(ApiErrorCode.INVALID_REQUEST_BODY, "Missing match_id");
            }
        }
        else {
            // socket.send(JSON.stringify({success: false, message: "Invalid data format"}));
            throw new ApiError(ApiErrorCode.INVALID_REQUEST_BODY, "Invalid data format");
        }
    })
}