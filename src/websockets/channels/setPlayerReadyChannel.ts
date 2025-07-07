import {webSockets} from "../websocket.registry";
import schema from "fluent-json-schema";
import WebsocketsManager from "../../managers/websockets.manager";
import MatchManager from "../../managers/match.manager";
import Player from "../../classes/Player";
import {IErrorResponse} from "../../interfaces/response.interface";

export function registerPlayerReadyChannel(): void {
	webSockets.register("set-player-ready", {
		schema: schema.object().valueOf(),
		handler: (_data, socket) => {
			const playerId = WebsocketsManager.getInstance().getUserIdFromSocket(socket)!;
			const match = MatchManager.getInstance().getMatchByPlayerId(playerId);
			if (!match) {
				socket.send(JSON.stringify({
					success: false,
					message: "Unable to find your current match"
				} as IErrorResponse));
				return
			}

			match.getPlayerById(playerId)!.ready = true;
			const players: Player[] = match.getPlayersInMatch();
			if (players.length != 2) {
				socket.send(JSON.stringify({
					success: false,
					message: `only ${players.length} player is present in match `
				} as IErrorResponse));
				return
			}
			players.forEach((player: Player) => {
				const playerSocket = WebsocketsManager.getInstance().getSocketFromUserId(player.playerId);
				if (!playerSocket) {
					socket.send(JSON.stringify({
						success: false,
						message: "Unable to find your socket from the id contained in the match"
					} as IErrorResponse));
					return;
				}
				playerSocket.send(JSON.stringify({
					channel: "ready-player",
					data: {user_id: playerId}
				}))
			})
		}
	});
}

