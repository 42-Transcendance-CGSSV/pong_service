import {eventEmitter} from "../app";
import {FastifyInstance} from "fastify";
import {getMatchData, getPlayerData, movePaddle, togglePauseMatch} from "../services/match.service";

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
        if (data && typeof data === "object") {
            // console.log("                               get-match-data", data && typeof data["match_id"]);
            if (typeof data["match_id"] === "number") {
                socket.send(JSON.stringify(getMatchData(data["match_id"])));
            }
            else {
                socket.send(JSON.stringify({success: false, message: "Missing match_id"}));
            }
        }
        else {
            socket.send(JSON.stringify({success: false, message: "Invalid data format"}));
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
            }
        }
        else {
            socket.send(JSON.stringify({success: false, message: "Invalid data format"}));
        }
    })
}