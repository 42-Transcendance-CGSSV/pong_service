import schema from "fluent-json-schema";
import {webSockets} from "../websocket.registry";
import WebsocketsManager from "../../managers/websockets.manager";
import MatchManager from "../../managers/match.manager";
import {togglePauseMatch} from "../../services/match.service";
import {IErrorResponse} from "../../interfaces/response.interface";


export function registerTogglePauseMatchChannel(): void {
	webSockets.register("toggle-pause-match", {
		schema: schema.object().valueOf(),
		handler: (_data, socket) => {
			const match = MatchManager.getInstance().getMatchByPlayerId(WebsocketsManager.getInstance().getUserIdFromSocket(socket)!);
			if (!match) {
				socket.send(JSON.stringify({
					success: false,
					message: "Unable to your current match"
				} as IErrorResponse));
				return;
			}

			socket.send(JSON.stringify(togglePauseMatch(match.matchId)));
		}
	});
}