import {app, eventEmitter} from "../app";
import MatchManager from "../managers/match.manager";
import WebsocketsManager from "../managers/websockets.manager";
import Match from "../classes/Match";
import Player from "../classes/Player";
import axios from "axios";
import * as https from "node:https";

interface GameEndStats {
    matchMode: string;
    player1Id: number;
    player2Id: number;
    player1Score: number;
    player2Score: number;
    player1BattedBalls: number;
    player2BattedBalls: number;
    duration: number;
    date: string;
}

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

        const players = match.getOnlinePlayerInMatch();
        sendMatchStats(match, players);


        const message = listener.winnerId ? JSON.stringify({
            channel: "match-end",
            data: {match_id: match.matchId, winner_id: listener.winnerId}
        }) : JSON.stringify({
            channel: "match-end",
            data: {match_id: match.matchId}
        });


        for (const p of players) {
            const socket = WebsocketsManager.getInstance().getSocketFromUserId(p.playerId)!;
            socket.send(message);
        }
    })


    eventEmitter.on("match-ended", (listener: any) => {
        if (!listener.matchId) {
            app.log.debug(`Match end without 'matchId'.`);
            return;
        }

    })
}

function sendMatchStats(match: Match, players: Player[]): void {
    const isp1ai = players[0]?.AI;
    const isp2ai = players[1]?.AI;
    const matchStats: GameEndStats = {
        matchMode: isp1ai || isp2ai ? "AI" : "NORMAL",
        player1Id: isp1ai ? (players[0].AI ? 0 : players[0].playerId) : players[0].playerId,
        player2Id: isp2ai ? (players[1].AI ? 0 : players[1].playerId) : players[1].playerId,
        player1Score: players[0].score,
        player2Score: players[1].score,
        player1BattedBalls: players[0].battedBalls,
        player2BattedBalls: players[1].battedBalls,
        duration: (match.endedAt - match.startedAt) / 1000,
        date: match.startedAt.toString()
    }
    const agent = new https.Agent({
        rejectUnauthorized: false
    });
    axios.post(`http://ft-transcendence-match-history:3004/match/full`, matchStats, {httpsAgent: agent}).then(() => {
        app.log.info("Match stats sent successfully !");
    }).catch(err => {
        app.log.error(`Unable to post match stats: ${err}`);
    });
}