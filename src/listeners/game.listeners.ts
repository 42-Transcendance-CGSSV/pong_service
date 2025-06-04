import {eventEmitter} from "../app";
import {FastifyInstance} from "fastify";
import { getAiNeeds, getMatchById, getMatchData, getPlayerData,  movePaddle, togglePauseMatch} from "../services/match.service";
import Match from "../classes/Match";

export function registerGameListeners(_app: FastifyInstance): void {

    eventEmitter.on("ws-message:move-paddle", (data: any, socket: WebSocket) => {
        console.log("                               move-paddle", data["user_id"], data["direction"]);
        if (data && typeof data === "object") {
            if (typeof data["user_id"] === "number") {
                if (data["direction"] && (data["direction"] === "up" || data["direction"] === "down")) {
                    socket.send(JSON.stringify(movePaddle(data["user_id"], data["direction"])));
                }
                else {
                    socket.send(JSON.stringify({success: false, message: "Invalid direction"}));
                }
            }
            else {
                socket.send(JSON.stringify({success: false, message: "Missing user_id"}));
            }
        }
        else {
            socket.send(JSON.stringify({success: false, message: "Invalid data format"}));
        }
    });

    eventEmitter.on("ws-message:get-player-data", (data: any, socket: WebSocket) => {
        if (data && typeof data === "object") {
            if (typeof data["user_id"] === "number") {
                socket.send(JSON.stringify(getPlayerData(data["user_id"])));
            }
            else {
                socket.send(JSON.stringify({success: false, message: "Missing user_id"}));
            }
        }
        else {
            socket.send(JSON.stringify({success: false, message: "Invalid data format"}));
        }
    });

    eventEmitter.on("ws-message:get-match-data", (data: any, socket: WebSocket) => {
        let match :Match | null;

        if (data && typeof data === "object") {
            // console.log("                               get-match-data", data && typeof data["match_id"]);
            if (typeof data["match_id"] === "number") {
                setInterval(async () =>{ 
                    match = getMatchById(data["match_id"]);
                    if (match)
                    await matchLoopView(match.match_id, socket)
                }, 17)   
                
            }
            else {
                socket.send(JSON.stringify({success: false, message: "Missing match_id"}));
            }
        }
        else {
            socket.send(JSON.stringify({success: false, message: "Invalid data format"}));
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
    const intervalManager: Map<number, WebSocket> = new Map();
    eventEmitter.on("ws-message:get-ia-needs-data", (data: any, socket: WebSocket) => {
        let match :Match | null;

        if (data && typeof data === "object" ) {
            if (typeof data["connection_id"] !== "number")
            {
                return socket.send(JSON.stringify({success: false, message: "Missing connection_id"}));
            }
            if (!intervalManager.has(data["connection_id"]))
                intervalManager.set(data["connection_id"], socket);
            if (typeof data["match_id"] === "number" && !intervalManager.has(data["match_id"])) {
                setInterval(async () =>{ 
                    match = getMatchById(data["match_id"]);
                    if (match && match.isRunning){
                        // console.log("SendAiNeedsView BEFORE:  ", Date.now())
                        await SendAiNeedsView(match.match_id, intervalManager.get(data["connection_id"]) as WebSocket)
                    }
                }, 30)
                
            }
            else if (typeof data["match_id"] != "number"){
                socket.send(JSON.stringify({success: false, message: "Missing match_id"}));
            }
            else if (intervalManager.has(data["match_id"])) {
                socket.send(JSON.stringify({success: false, message: "Already listening to this match"}));
            }
        }
        else {
            socket.send(JSON.stringify({success: false, message: "Invalid data format"}));
        }
    })

    function SendAiNeedsView(match_id: number, socket: WebSocket) : Promise<void>
    {
        // console.log("SendAiNeedsView", match_id)
        return new Promise((resolve, _reject) =>{
            console.log("time between updates: ", Date.now() - time_between_updates)
            socket.send(JSON.stringify(getAiNeeds(match_id)))
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
                socket.send(JSON.stringify({success: false, message: "Missing match_id"}));
            }
        }
        else {
            socket.send(JSON.stringify({success: false, message: "Invalid data format"}));
        }
    })
}