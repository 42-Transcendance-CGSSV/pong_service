import Match from "../classes/Match";
import Player from "../classes/Player";
import Ball from "../classes/Ball";
import WebsocketsManager from "./websockets.manager";
import {ISuccessResponse} from "../interfaces/response.interface";
import {endMatch} from "../services/match.service";

export default class MatchManager {

    private static instance: MatchManager | null = null;
    public matches: Map<Player, Match> = new Map();
    public matchCounter: number = 0;

    public constructor() {
        setInterval(async () => {
            for (const match of this.matches.values()) {
                if (!match.isRunning) continue;

                for (const playersInMatch of match.getPlayersInMatch()) {
                    const socket = WebsocketsManager.getInstance().getSocketFromUserId(playersInMatch.playerId);
                    if (!socket) {
                        match.winnerId = match.getOnlinePlayerInMatch().pop()!.getID();
                        endMatch(match, -1);
                        continue;
                    }
                    if (!playersInMatch.AI)
                        socket.send(JSON.stringify({
                            success: true,
                            message: "",
                            data: match.exportRenderInfo(),
                            errorCode: "200"
                        } as ISuccessResponse))
                }
            }
        }, 17)
    }

    public static getInstance(): MatchManager {
        return this.instance ? this.instance : (this.instance = new MatchManager());
    }

    public createMatch(scoreGoal: number = 11, p1: Player, p2: Player): Match {
        let match = new Match(scoreGoal);
        match.addPlayer(p1);
        match.addPlayer(p2);
        this.matches.set(p1, match);
        this.matches.set(p2, match);
        return match;
    }

    public createPlayer(userId: number, isAI: boolean, isTraining: boolean): Player {
        return new Player(userId, isAI, isTraining);
    }

    public removeMatch(match: Match): void {
        for (const [player, m] of this.matches.entries()) {
            if (m === match) {
                this.matches.delete(player);
            }
        }
    }

    public countMatches(): number {
        const uniqueMatches = new Set(this.matches.values());
        return uniqueMatches.size;
    }

    public getMatchById(match_id: number): Match | null {
        for (const match of this.matches.values()) {
            if (match && match.matchId === match_id) {
                return match;
            }
        }
        return null;
    }

    public getMatchByBall(ball: Ball): Match | null {
        for (const match of this.matches.values()) {
            if (match && match.isSameBall(ball)) {
                return match;
            }
        }
        return null;
    }

    public getMatchByPlayer(player: Player): Match | null {
        return this.matches.get(player) || null;
    }

    public getMatchByPlayerId(playerId: number): Match | null {
        for (const match of this.matches.values()) {
            if (match && match.players.find(player => player.playerId === playerId)) {
                return match;
            }
        }
        return null;
    }

    public getPlayersByBall(ball: Ball): Player[] | null {
        const match = this.getMatchByBall(ball);
        if (!match) return null;
        return match.players || null;
    }

}