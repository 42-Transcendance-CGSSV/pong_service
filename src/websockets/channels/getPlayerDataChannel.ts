import schema from "fluent-json-schema";
import { webSockets } from "../websocket.registry";
import {getPlayerData} from "../../services/match.service";


export function registerGetPlayerDataChannel(): void {
    webSockets.register("get-player-data", {
        schema: schema.object().prop("user_id", schema.number().minimum(1).required()).valueOf(),
        handler: (data, socket) =>  socket.send(JSON.stringify(getPlayerData(data["user_id"])))
    });
}

