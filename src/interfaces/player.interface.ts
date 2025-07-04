import {ScoreRegistryInterface} from "./score.registry.interface";

interface PlayerInterface {
    playerId        : number;
    currentMatchId  : number;
    tainingData   : ScoreRegistryInterface | null;
    playerName      : string;
    PaddlePos       : number;
    moveSpeed       : number;
    side            : number;
    score   : number;
    playerColor     : string;
    AI              : boolean;
    isTraining      : boolean;
}

export default PlayerInterface;
