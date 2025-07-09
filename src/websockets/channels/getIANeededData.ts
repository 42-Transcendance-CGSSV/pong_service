import schema from "fluent-json-schema";
import {webSockets} from "../websocket.registry";
import {getAiNeeds} from "../../services/match.service";
import {app} from "../../app";
import {env} from "../../utils/environment";
import type {WebSocket} from "ws";

const intervalMap = new Map<WebSocket, NodeJS.Timeout>();

export function registerGetIaNeededData(): void {

    webSockets.register("get-ia-needs-data", {
        schema: schema.object().valueOf(),
        handler: (_data, socket) => {
            if (intervalMap.has(socket)) {
                return;
            }
            intervalMap.set(socket, setInterval(() => SendAiNeedsView(socket), 1000 / env.TIME_MULTIPLIER));
        }
    });
}

function SendAiNeedsView(socket: WebSocket): void {
    if (socket.readyState !== socket.CONNECTING && socket.readyState !== socket.OPEN) {
        clearInterval(intervalMap.get(socket));
        intervalMap.delete(socket);
        return;
    }
    let payload: string = JSON.stringify(getAiNeeds(socket))
    if (!payload) {
        app.log.error("Error: No payload to send");
        return;
    }
    socket.send(payload)
    app.log.debug("Sent payload on get-ia-needs-data")
}



