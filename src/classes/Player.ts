import dotenv from 'dotenv'
import { getRandomColor } from '../utils/getRandomColor';


dotenv.config();
let timeMultiplier = Number(process.env.TIME_MULTIPLIER);


export class Player {
    private PlayerID: number;
    private PaddlePos: number;
    private PaddleHeight: number;
    private canvasHeight: number;
    private moveSpeed: number;
    private side: "right" | "left";
    public numberOfGoals: number = 0;
    public playerColor: string = getRandomColor();
    // public AI?: AI = undefined;
    
    constructor(playerID: number, PaddlePos: number, PaddleHeight: number, canvasHeight: number, moveSpeed: number, side: "right" | "left"){//, AI?: AI) {
      this.PlayerID = playerID;
      this.PaddlePos = PaddlePos;
      this.PaddleHeight = PaddleHeight;
      this.canvasHeight = canvasHeight;
      this.moveSpeed = moveSpeed * timeMultiplier;
      this.side = side;
    //   this.AI = AI;
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

    ExportPlayerInfo() {
        return ({
            PlayerID        : this.PlayerID       ,
            PaddlePos       : this.PaddlePos      ,
            PaddleHeight    : this.PaddleHeight   ,
            canvasHeight    : this.canvasHeight   ,
            moveSpeed       : this.moveSpeed      ,
            side            : this.side           ,
            numberOfGoals   : this.numberOfGoals  ,
            playerColor     : this.playerColor      
    });
    }
}