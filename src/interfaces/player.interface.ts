interface PlayerInterface {
    PlayerID: number;
    PlayerName: string;
    PaddlePos: number;
    canvasHeight: number;
    moveSpeed: number;
    side: string;
    numberOfGoals: number;
    playerColor: string;
    AI: boolean;
}

export default PlayerInterface;
