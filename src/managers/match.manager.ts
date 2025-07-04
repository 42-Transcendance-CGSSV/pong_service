import Match from "../classes/Match";
import Player from "../classes/Player";
import Ball from "../classes/Ball";
import {app} from "../app";
import WebsocketsManager from "./websockets.manager";
import {ISuccessResponse} from "../interfaces/response.interface";

export default class MatchManager {

    private static instance: MatchManager | null = null;
    public matches: Match[] = [];
    public players: Player[] = [];
    private matchCounter: number = 0;

    public constructor() {
        setInterval(async () => {
            for (const match of this.matches) {
                if (!match.isRunning || match.isExpired()) continue;
                for (const playersInMatch of match.getPlayersInMatch()) {
                    const socket = WebsocketsManager.getInstance().getSocketFromUserId(playersInMatch.playerId);
                    if (!socket) continue;
                    socket.send(JSON.stringify({success: true, message: "Match found", data: match.exportRenderInfo(), errorCode: "200"} as ISuccessResponse))
                }
            }
        }, 17)
    }

    public purgePlayer(player_id: number): void {
        this.players = this.players.filter(player => player.playerId !== player_id);
        this.matches.forEach(match => match.players = match.players.filter(p => p.playerId !== player_id));
        return;
    }

    public createMatch(scoreGoal: number): Match {
        let match = new Match(scoreGoal, MatchManager.getInstance().matchCounter++);
        this.matches.push(match);
        return match;
    }

    public createPlayer(player_name: string, user_id: number, is_ai: boolean, isTraining: boolean): Player {
        let player = new Player(player_name, user_id, is_ai, isTraining);
        this.players.push(player);
        return player;
    }

    public seatPlayer(player_id: number, match_id: number): boolean {
        for (const match of this.matches) {
            if (match.match_id === match_id) {
                for (const player of this.players) {
                    if (player.playerId === player_id) {
                        if (match.players.length < 2 && !match.isRunning) {
                            return match.addPlayer(player);
                        } else {
                            app.log.error("Match is already running or full");
                            return false;
                        }
                    }
                }
            }
        }
        return false;
    }

    public playerExists(player_id: number): boolean {
        for (const player of this.players) {
            if (player.playerId === player_id) {
                return true;
            }
        }
        return false;
    }

    public removeMatch(match: Match): void {
        if (this.matches.includes(match)) {
            this.matches.splice(this.matches.indexOf(match), 1);
        }
    }

    public removePlayer(player: Player): void {
        if (this.players.includes(player)) {
            this.players.splice(this.players.indexOf(player), 1);
        }
    }

    public countMatches(): number {
        return this.matches.length;
    }

    public getOpenMatches(): Match[] {
        return this.matches.filter(match => match.players.length < 2 && !match.isRunning);
    }

    public getMatchById(match_id: number): Match | undefined {
        let tmp: Match | undefined = undefined;
        for (const match of this.matches) {
            if (!match)
                continue;
            // console.log("Checking match with ID:", typeof(match.match_id) + " against " + typeof(match_id));
            if (match.match_id === match_id as number) {
                tmp = match;
                // console.log("Match found with ID:", match.match_id);
                break;
            }
        }
        return tmp;
    }

    public getMatchByBall(ball: Ball): Match | null {
        for (const match of this.matches) {
            if (!match)
                continue;
            if (match.isSameBall(ball))
                return match;
        }
        return null;
    }

    public getMatchByPlayer(player: Player): Match | null {
        for (const match of this.matches) {
            if (!match)
                continue;
            if (match.players.includes(player))
                return match;
        }
        return null;
    }

    public getMatchByPlayerId(Player_id: number): Match | null {
        for (const match of this.matches) {
            if (!match)
                continue;
            if (match.players.find(player => player.playerId === Player_id))
                return match;
        }
        return null;
    }

    public getPlayersByBall(ball: Ball): Player[] | null {
        let match = this.getMatchByBall(ball);
        if (!match)
            return null;
        if (!match.players)
            return null;
        return match.players;
    }

    public static getInstance(): MatchManager {
        return this.instance ? this.instance : (this.instance = new MatchManager());
    }

}