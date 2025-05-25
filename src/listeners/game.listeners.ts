import {eventEmitter} from "../app";
import {FastifyInstance} from "fastify";
import {movePaddle} from "../utils/sendItems";

export function registerGameListeners(_app: FastifyInstance): void {

    eventEmitter.on("ws-message:move-paddle", (data: any, socket: WebSocket) => {
        if (data && typeof data === "object") {
            //TODO: Replace string with number
            if (data["user_id"] && typeof data["user_id"] === "string") {
                if (data["direction"] && (data["direction"] === "up" || data["direction"] === "down")) {
                    socket.send(JSON.stringify(movePaddle(data["user_id"], data["direction"])));
                }
            }
        }
    });


}