import {ScoreRegistryInterface} from "./score.registry.interface";

interface PlayerInterface {
    playerId        : number;
    currentMatchId  : number;
    trainingData   : ScoreRegistryInterface | null;
    paddlePos       : number;
    side            : number;
    score           : number;
    AI              : boolean;
    isTraining      : boolean;
}

export default PlayerInterface;
