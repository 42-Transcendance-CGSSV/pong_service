import PlayerInterface from "./player.interface";
import BallInterface from "./ball.interface";

interface GameInterface {
    player1: PlayerInterface;
    scorePlayer1: number;

    player2: PlayerInterface;
    scorePlayer2: number;

    ball: BallInterface;

    scoreGoal: number;

    startedAt: number;
    endedAt: number;

    winnerId: number;
}

export default GameInterface;
