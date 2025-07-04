import schema from "fluent-json-schema";
import { webSockets } from "../websocket.registry";
import WebsocketsManager from "../../managers/websockets.manager";
import MatchManager from "../../managers/match.manager";


export function registerTogglePauseMatchChannel(): void {
    webSockets.register("toggle-pause-match", {
        schema: schema.object().valueOf(),
        handler: (_data, socket) => {
            socket.send(JSON.stringify(MatchManager.getInstance().getMatchByPlayerId(WebsocketsManager.getInstance().getUserIdFromSocket(socket)!)));
        }
    });
}