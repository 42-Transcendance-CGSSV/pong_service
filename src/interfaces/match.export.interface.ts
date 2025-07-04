import BallExportInfo from "./ball.info.interface";
import PlayerInterface from "./player.interface";

interface MatchExportInterface {
    isRunning: boolean;
    match_id: number;
    players: PlayerInterface[];
    ball: BallExportInfo;
    scoreGoal: number;
    startedAt: number;
    pausedAt: number;
    endedAt: number;
    winner_id: number;
}

export default MatchExportInterface;