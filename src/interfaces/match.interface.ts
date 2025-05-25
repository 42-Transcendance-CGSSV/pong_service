import PlayerInterface from "./player.interface";
import BallInterface from "./ball.interface";

interface matchInterface {
    matchID: string;
    players: PlayerInterface[];
    ball: BallInterface;
    scoreGoal: number;
    startedAt: number;
    pausedAt: number;
    endedAt: number;
    winnerId: string | null;
}

export default matchInterface;