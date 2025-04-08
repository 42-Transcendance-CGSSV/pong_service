interface PlayerInterface {
    PlayerID        : string;
    currentBellong  : number;
    PlayerName      : string;
    PaddlePos       : number;
    moveSpeed       : number;
    side            : string;
    numberOfGoals   : number;
    playerColor     : string;
    AI              : boolean;
}

export default PlayerInterface;
