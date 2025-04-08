import PlayerInterface from "./player.interface";
import BallInterface from "./ball.interface";

interface matchInterface {
    MatchIndex  : number;
    players     : PlayerInterface[];
    ball        : BallInterface;
    scoreGoal   : number;
    startedAt   : number;
    endedAt     : number;
    winnerId    : string | null;
}

export default matchInterface;