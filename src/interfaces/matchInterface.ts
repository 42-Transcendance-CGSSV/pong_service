import PlayerInterface from "./player.interface";
import BallInterface from "./ball.interface";

interface MatchInterface {
    matchId: number;
    players: PlayerInterface[];
    ball: BallInterface;
    scoreGoal: number;
    startedAt: number;
    pausedAt: number;
    endedAt: number;
    winnerId: number;
}

export default MatchInterface;