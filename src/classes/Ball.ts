import { Player } from "./Player";
import { TIME_MULTIPLIER , CANVAS_HEIGHT, CANVAS_WIDTH} from "../utils/constants";

export class Ball {
    private ballID          :   number;
    private ballX           :   number;
    private ballY           :   number;
    private ballRadius      :   number;
    private ballSpeedX      :   number;
    private ballSpeedY      :   number;
    private canvasWidth     :   number;
    private canvasHeight    :   number;
    public  players         :   Player[] = [];
    // private lastToHit       ?:  Player;
    // private maxScore        :   number = 5;
    
    constructor(ballID:number , ballRadius:number , ballSpeedX: number, ballSpeedY: number) {
      this.canvasWidth = CANVAS_WIDTH;
      this.canvasHeight = CANVAS_HEIGHT;
      this.ballX = CANVAS_WIDTH / 2;
      this.ballY = CANVAS_HEIGHT / 2;
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
        this.ballX = this.canvasWidth / 2;
        this.ballY = this.canvasHeight / 2;
        this.ballSpeedX = -this.ballSpeedX;
        this.ballSpeedY = Math.floor(Math.random() * 10) - 5;
        return false;
      }
      
      for (let i = 0; i < this.players.length; i++) {
        const player = this.players[i];
        // console.log(this.paddleHeight);
        if (
          player &&
          player.getSide() === "left" &&
          this.ballX - this.ballRadius < player.getPaddleWidth() &&
          this.ballY > player.getPos() &&
          this.ballY < player.getPos() + player.getPaddleHeight()){
            // console.log(this.ballRadius);
          this.ballSpeedX = -this.ballSpeedX;
          this.ballSpeedX += 1;
          this.ballSpeedY += Math.floor(Math.random() * 10) - 5;
          // this.lastToHit = player;
          break;
        }
        if (
          player &&
          player.getSide() === "right" &&
          this.ballX + this.ballRadius > this.canvasWidth - player.getPaddleWidth() &&
          this.ballY > player.getPos() &&
          this.ballY < player.getPos() + player.getPaddleHeight()){ 
            // console.log(this.ballRadius);
          this.ballSpeedX = -this.ballSpeedX;
          this.ballSpeedX += 1;
          this.ballSpeedY += Math.floor(Math.random() * 10) - 5;
          // console.log(this.ballSpeedX , this.ballSpeedY);
          // this.lastToHit = player;
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