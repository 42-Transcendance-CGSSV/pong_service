import dotenv from 'dotenv'
import { getRandomColor } from '../utils/getRandomColor';
// import { CANVAS_HEIGHT } from '../utils/constants';


dotenv.config();
let timeMultiplier = Number(process.env.TIME_MULTIPLIER);

export type PlayerArgs = [
    playerID      : number,
    PlayerName    : string,
    PaddleHeight  : number,
    PaddleWidth   : number,
    canvasHeight  : number,
    moveSpeed     : number,
    side          : "right" | "left",
    // AI            : boolean
]

export class Player {
    private PlayerID: number;
    public  PlayerName: string;
    private PaddlePos: number;
    private PaddleHeight: number;
    private PaddleWidth: number;
    private canvasHeight: number;
    private moveSpeed: number;
    private side: "right" | "left";
    public numberOfGoals: number = 0;
    public playerColor: string = getRandomColor();
    public AI: boolean = true;
    
    constructor(playerID: number, PlayerName: string, PaddleHeight: number, PaddleWidth: number, canvasHeight: number, moveSpeed: number, side: "right" | "left", AI?: boolean) {
      this.PlayerID = playerID;
      this.PlayerName = PlayerName;
      this.PaddlePos = PaddleHeight / 2;
      this.PaddleHeight = PaddleHeight;
      this.PaddleWidth = PaddleWidth;
      this.canvasHeight = canvasHeight;
      this.moveSpeed = moveSpeed * timeMultiplier;
      this.side = side;
      this.AI = AI ?? true;
    }
    
    getSide() {
      return this.side;
    }
    moveUp() {
      if (this.PaddlePos > 0) 
        this.PaddlePos -= this.moveSpeed;
    };
    moveDown() {
      if (this.PaddlePos < this.canvasHeight - this.PaddleHeight) 
        this.PaddlePos += this.moveSpeed;
    }
    getID() {
      return this.PlayerID;
    }
    getPos() {
      return this.PaddlePos;
    }
    getPaddleHeight() {
      return this.PaddleHeight;
    }
    getPaddleWidth() {
      return this.PaddleWidth;
    }

    ExportPlayerInfo() {
      
        return ({
            PlayerID        : this.PlayerID       ,
            PlayerName      : this.PlayerName     ,
            PaddlePos       : this.PaddlePos      ,
            PaddleHeight    : this.PaddleHeight   ,
            canvasHeight    : this.canvasHeight   ,
            moveSpeed       : this.moveSpeed      ,
            side            : this.side           ,
            numberOfGoals   : this.numberOfGoals  ,
            playerColor     : this.playerColor    ,
            AI              : this.AI
    });
    }
}