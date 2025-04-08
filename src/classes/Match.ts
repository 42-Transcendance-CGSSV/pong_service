import { randomUUID } from "crypto";
import matchInterface from "../interfaces/match.interface";
import Ball  from "./Ball";
import Player from "./Player";

class Match implements matchInterface {
    public              isRunning       : boolean = false;
    public readonly     MatchIndex      : number;
    public readonly     matchID         : string;
    public readonly     ball            : Ball;
    public              players         : Player[] = [];
    public readonly     scoreGoal       : number;
    public              startedAt       : number;
    public              endedAt         : number;
    public              winnerId        : string;

    public constructor(matchIndex: number, scoreGoal: number) {
        this.MatchIndex = matchIndex;
        this.ball = new Ball(10, 3, 3);
        this.scoreGoal = scoreGoal;
        this.startedAt = -1;
        this.endedAt = -1;
        this.winnerId = "";

        this.matchID = randomUUID();
    }

    public initNewPlayer(player: Player): void {
        if (this.players.length >= 2) {
            throw new Error("Match is full");
        }
        this.players.push(player);
    }


    public getPlayersInMatch(): Player[] {
        return this.players;
    }

    public isExpired(): boolean {
        return this.startedAt + 60 * 60000 > Date.now();
    }

    public isSameBall(ball: Ball): boolean {
        return ball === this.ball;
    }

    public exportMatchInfo(): matchInterface {
        return this;
    }
}

export default Match;
