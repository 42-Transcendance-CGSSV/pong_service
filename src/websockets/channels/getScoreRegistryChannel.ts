import schema from "fluent-json-schema";
import { webSockets } from "../websocket.registry";
import {app} from "../../app";
import {SendAllowed} from "../../classes/Ball";


export function registerGetScoreRegistry(): void {
    webSockets.register("get-score-registry", {
        schema: schema.object().valueOf(),
        handler: (_data, socket) => {
            let payload: string = JSON.stringify(SendAllowed.get())
            if (!payload || payload === "[]" || payload === null || payload === "null")
                return app.log.error("Error: No payload to send");
            socket.send(payload)
        }
    });
}




