import { Player } from "./Player";
import { TIME_MULTIPLIER } from "../utils/constants";

export class Ball {
    private ballID          :   number;
    private ballX           :   number;
    private ballY           :   number;
    private ballRadius      :   number;
    private ballSpeedX      :   number;
    private ballSpeedY      :   number;
    private canvasWidth     :   number;
    private canvasHeight    :   number;
    private paddleHeight    :   number;
    public  players         :   Player[] = [];
    private lastToHit       ?:  Player;
    private maxScore        :   number = 5;
    
    constructor(ballID:number , ballX: number, ballY: number, ballRadius:number , ballSpeedX: number, ballSpeedY: number, canvasWidth: number, canvasHeight: number, paddleHeight: number ) {
      this.paddleHeight = paddleHeight;
      this.canvasWidth = canvasWidth;
      this.canvasHeight = canvasHeight;
      this.ballX = ballX;
      this.ballY = ballY;
      this.ballRadius = ballRadius;
      this.ballSpeedX = ballSpeedX * TIME_MULTIPLIER;
      this.ballSpeedY = ballSpeedY * TIME_MULTIPLIER;

      this.ballID = ballID;
    }
    
    getBallX() {
      return this.ballX;
    }
    getBallY() {
      return this.ballY;
    }
    getBallSpeedX() {
      return this.ballSpeedX;
    }
    getBallSpeedY() {
      return this.ballSpeedY;
    }
    
    initNewPlayer(player: Player) {
      this.players.push(player);
    }
    
    moveBall() {
      this.ballX += this.ballSpeedX;
      this.ballY += this.ballSpeedY;
      
      if (this.ballY - this.ballRadius < 0 || this.ballY + this.ballRadius > this.canvasHeight) {
        this.ballSpeedY = -this.ballSpeedY;
      }
    }
    
    checkCollision() {
  
      if (this.ballX < 0 || this.ballX > this.canvasWidth) {
        if (this.lastToHit) {
          this.lastToHit.numberOfGoals++;
          if (this.lastToHit.numberOfGoals >= this.maxScore) {
            return true;
          }
        }
        this.ballX = this.canvasWidth / 2;
        this.ballY = this.canvasHeight / 2;
        this.ballSpeedX = -this.ballSpeedX;
        this.ballSpeedY = Math.floor(Math.random() * 10) - 5;
        return false;
      }
      
      for (let i = 0; i < this.players.length; i++) {
        const player = this.players[i];
        if (
            player &&
            player.getSide() === "left" && 
            this.ballX - this.ballRadius < 10 && 
            this.ballY > player.getPos() && 
            this.ballY < player.getPos() + this.paddleHeight)
        {
          this.ballSpeedX = -this.ballSpeedX;
          this.ballSpeedX += 1;
          this.ballSpeedY += Math.floor(Math.random() * 10) - 5;
          this.lastToHit = player;
          break;
        }
        if (
          player &&
          player.getSide() === "right" &&
          this.ballX + this.ballRadius > this.canvasWidth - 10 && 
          this.ballY > player.getPos() && 
          this.ballY < player.getPos() + this.paddleHeight
        ) {
          this.ballSpeedX = -this.ballSpeedX;
          this.ballSpeedX += 1;
          this.ballSpeedY += Math.floor(Math.random() * 10) - 5;
          // console.log(this.ballSpeedX , this.ballSpeedY);
          this.lastToHit = player;
          break;
        }
      };
      
      return false;
    }
    ExportBallInfo() 
    {
        let playersStatus = this.players.map((player) => player.ExportPlayerInfo());
        return {
        ballID          : this.ballID,
        ballX           : this.ballX,
        ballY           : this.ballY,
        playersInfo     : playersStatus
        };
    }
}