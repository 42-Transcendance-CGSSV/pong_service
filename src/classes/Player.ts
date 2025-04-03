import { getRandomColor } from "../utils/getRandomColor";
import PlayerInterface from "../interfaces/player.interface";
import { env } from "../utils/environment";

export class Player implements PlayerInterface {
    public readonly PlayerID: number;
    public readonly PlayerName: string;
    public readonly canvasHeight: number;
    public readonly moveSpeed: number;
    public readonly side: string;
    public PaddlePos: number;
    public numberOfGoals: number = 0;
    public playerColor: string = getRandomColor();
    public AI: boolean = true;

    public constructor(playerID: number, PlayerName: string, canvasHeight: number, moveSpeed: number, side: string, AI?: boolean) {
        this.PlayerID = playerID;
        this.PlayerName = PlayerName;
        this.PaddlePos = env.CANVAS_HEIGHT / 2 - env.PADDLE_HEIGHT / 2;
        this.canvasHeight = canvasHeight;
        this.moveSpeed = moveSpeed * Number(process.env.TIME_MULTIPLIER);
        this.side = side;
        this.AI = AI ?? true;
    }

    public moveUp(): void {
        if (this.PaddlePos > 0) this.PaddlePos -= this.moveSpeed;
    }
    public moveDown(): void {
        if (this.PaddlePos < this.canvasHeight - env.PADDLE_HEIGHT) this.PaddlePos += this.moveSpeed;
    }

    public ExportPlayerInfo(): PlayerInterface {
        return this;
    }
}
