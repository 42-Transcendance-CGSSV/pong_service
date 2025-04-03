import GameInterface from "../interfaces/game.interface";
import PlayerInterface from "../interfaces/player.interface";
import { Ball } from "./Ball";

class Game implements GameInterface {
    public readonly ball: Ball;
    public readonly player1: PlayerInterface;
    public readonly player2: PlayerInterface;
    public scorePlayer1: number;
    public scorePlayer2: number;
    public readonly scoreGoal: number;
    public readonly startedAt: number;
    public endedAt: number;
    public winnerId: number;

    public constructor(player1: PlayerInterface, player2: PlayerInterface, scoreGoal: number) {
        this.ball = new Ball(10, 3, 3);
        this.player1 = player1;
        this.player2 = player2;
        this.scorePlayer1 = 0;
        this.scorePlayer2 = 0;
        this.scoreGoal = scoreGoal;
        this.startedAt = Date.now();
        this.endedAt = -1;
        this.winnerId = -1;
    }

    public isExpired(): boolean {
        return this.startedAt + 60 * 60000 > Date.now();
    }

    public isSameBall(ball: Ball): boolean {
        return ball === this.ball;
    }

}

export default Game;
