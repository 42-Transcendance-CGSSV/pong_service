import {eventEmitter} from "../app";
import {FastifyInstance} from "fastify";
import {getMatchData, getPlayerData, movePaddle, togglePauseMatch} from "../services/match.service";

export function registerGameListeners(_app: FastifyInstance): void {

    eventEmitter.on("ws-message:move-paddle", (data: any, socket: WebSocket) => {
        if (data && typeof data === "object") {
            //TODO: Replace string with number
            if (data["user_id"] && typeof data["user_id"] === "string") {
                if (data["direction"] && (data["direction"] === "up" || data["direction"] === "down")) {
                    socket.send(JSON.stringify(movePaddle(data["user_id"], data["direction"])));
                }
                //TODO: Add error handling for missing user_id or direction
            }
        }
    });

    eventEmitter.on("ws-message:get-player-data", (data: any, socket: WebSocket) => {
        if (data && typeof data === "object") {
            //TODO: Replace string with number
            if (data["user_id"] && typeof data["user_id"] === "string") {
                socket.send(JSON.stringify(getPlayerData(data["user_id"])));
            }
            //TODO: Add error handling for missing user_id
        }
    });

    eventEmitter.on("ws-message:get-match-data", (data: any, socket: WebSocket) => {
        if (data && typeof data === "object") {
            if (data["match_id"] && typeof data["match_id"] === "string") {
                socket.send(JSON.stringify(getMatchData(data["match_id"])));
            }
            //TODO: Add error handling for missing match_id
        }
    })

    eventEmitter.on("ws-message:toggle-pause-match", (data: any, socket: WebSocket) => {
        if (data && typeof data === "object") {
            if (data["match_id"] && typeof data["match_id"] === "string") {
                socket.send(JSON.stringify(togglePauseMatch(data["match_id"])));
            }
            //TODO: Add error handling for missing match_id
        }
    })
}