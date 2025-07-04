import schema from "fluent-json-schema";
import { webSockets } from "../websocket.registry";
import {movePaddle} from "../../services/match.service";
import WebsocketsManager from "../../managers/websockets.manager";


export function registerMovePaddleChannel(): void {
    webSockets.register("move-paddle", {
        schema: schema.object().prop("direction", schema.string().enum(["up", "down"]).required()).valueOf(),
        handler: (data, socket) => socket.send(JSON.stringify(movePaddle(WebsocketsManager.getInstance().getUserIdFromSocket(socket)!, data["direction"])))
    });
}

