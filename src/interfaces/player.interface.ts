interface PlayerInterface {
    PlayerID        : string;
    currentMatchId  : string;
    PlayerName      : string;
    PaddlePos       : number;
    moveSpeed       : number;
    side            : string;
    numberOfGoals   : number;
    playerColor     : string;
    AI              : boolean;
}

export default PlayerInterface;
