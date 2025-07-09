import schema from "fluent-json-schema";
import { webSockets } from "../websocket.registry";
import {getAiNeeds} from "../../services/match.service";
import {clearInterval} from "timers";
import {app} from "../../app";
import {env} from "../../utils/environment";
import type {WebSocket} from "ws";


export function registerGetIaNeededData(): void {
    const intervalMap = new Map<WebSocket, NodeJS.Timeout>();

    webSockets.register("get-ia-needs-data", {
        schema: schema.object().valueOf(),
        handler: (_data, socket) => {
            if (intervalMap.has(socket)) {
                clearInterval(intervalMap.get(socket));
                intervalMap.delete(socket);
                // app.log.info("Cleared interval for ai needs data");
            }
            intervalMap.set(socket, setInterval(async () => await SendAiNeedsView(socket), 1000 / env.TIME_MULTIPLIER));
        }
    });
}

async function SendAiNeedsView(socket: WebSocket): Promise<void> {
    return new Promise((resolve, reject) => {
        let payload: string = JSON.stringify(getAiNeeds(socket))
        if (!payload) return reject(() => app.log.info("Error: No payload to send"));
        socket.send(payload)
        resolve();
    })
}



