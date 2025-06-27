import {score_registry_interface} from "./score.registry.interface";

interface PlayerInterface {
    Player_id        : number;
    currentmatch_id  : number;
    tainingData   : score_registry_interface | null;
    PlayerName      : string;
    PaddlePos       : number;
    moveSpeed       : number;
    side            : number;
    score   : number;
    playerColor     : string;
    AI              : boolean;
    isTraining      : boolean;
}

export default PlayerInterface;
