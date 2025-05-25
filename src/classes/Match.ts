import {randomUUID} from "crypto";
import matchInterface from "../interfaces/match.interface";
import Ball from "./Ball";
import Player from "./Player";
import {env} from "../utils/environment";

class Match implements matchInterface {
    public isRunning: boolean = false;
    public readonly matchID: string;
    public readonly ball: Ball;
    public players: Player[] = [];
    public readonly scoreGoal: number;
    public startedAt: number;
    public pausedAt: number = -1;
    public endedAt: number;
    public winnerId: string | null;


    public constructor(scoreGoal: number) {
        this.ball = new Ball(10, 3, 3);
        this.scoreGoal = scoreGoal;
        this.startedAt = -1;
        this.endedAt = -1;
        this.winnerId = null;

        this.matchID = randomUUID();
    }

    public resetMatch(): void {
        this.isRunning = false;
        for (const player of this.players) {
            player.numberOfGoals = 0;
            player.PaddlePos = env.CANVAS_HEIGHT / 2 - env.PLAYER_PADDLE_HEIGHT / 2;
        }
        this.ball.ballX = env.CANVAS_WIDTH / 2;
        this.ball.ballY = env.CANVAS_HEIGHT / 2;
        this.ball.lastToHit = undefined;
    }

    public checkForWinner(): void {
        for (const player of this.players) {
            if (player.numberOfGoals >= this.scoreGoal) {
                this.isRunning = false;
                this.endedAt = Date.now();
                this.winnerId = player.PlayerID;
                console.log(`Player ${player.PlayerName} won the match!`);
                this.resetMatch();
                return;
            }
        }
    }

    public addPlayer(PlayerName: string, AI?: boolean): void {
        let side: "right" | "left" = "left";
        if (this.players && this.players[0]) {
            side = this.players[0].getSide() === "left" ? "right" : "left";
        }
        let player = new Player(PlayerName, this.matchID, side, AI);
        this.players.push(player);
    }

    public getPlayersInMatch(): Player[] {
        return this.players;
    }

    public playerIsInMatch(player: Player): boolean {
        return this.players.includes(player);
    }

    public getPlayerById(playerId: string): Player | undefined {
        return this.players.find(player => player.PlayerID === playerId);
    }


    public isExpired(): boolean {
        return this.startedAt + 60 * 60000 > Date.now();
    }

    public isSameBall(ball: Ball): boolean {
        return ball === this.ball;
    }
}

export default Match;
