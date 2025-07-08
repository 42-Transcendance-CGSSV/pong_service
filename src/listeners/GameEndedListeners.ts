import {app, eventEmitter} from "../app";
import MatchManager from "../managers/match.manager";
import WebsocketsManager from "../managers/websockets.manager";

export function registerGameEndedListeners() {

    eventEmitter.on("match-ended", (listener: any) => {
        if (!listener.matchId) {
            app.log.debug(`Match end without 'matchId'.`);
            return;
        }

        const match = MatchManager.getInstance().getMatchById(listener.matchId);
        if (!match) {
            app.log.warn(`[match-ended] match with id ${listener.matchId} not fount`);
            return;
        }

        const message = listener.winnerId ? JSON.stringify({
            channel: "match-end",
            data: {match_id: match.matchId, winner_id: listener.winnerId}
        }) : JSON.stringify({
            channel: "match-end",
            data: {match_id: match.matchId}
        });

        for (const players of match.getOnlinePlayerInMatch()) {
            const socket = WebsocketsManager.getInstance().getSocketFromUserId(players.playerId)!;
            socket.send(message);
        }
    })


    eventEmitter.on("match-ended", (listener: any) => {
        if (!listener.matchId) {
            app.log.debug(`Match end without 'matchId'.`);
            return;
        }

        //TODO: send data to chriss;
    })
};