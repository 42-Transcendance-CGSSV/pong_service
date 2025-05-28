interface PlayerInterface {
    Player_id        : number;
    currentmatch_id  : number;
    PlayerName      : string;
    PaddlePos       : number;
    moveSpeed       : number;
    side            : string;
    score   : number;
    playerColor     : string;
    AI              : boolean;
}

export default PlayerInterface;
