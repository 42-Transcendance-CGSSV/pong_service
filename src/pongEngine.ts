import { Player } from "./classes/Player";
import { Ball } from "./classes/Ball";
import {CANVAS_HEIGHT , UPDATE_INTERVAL_MS} from "./utils/constants";

let paddleHeight = 80;
let paddleWidth = 10;

class pongEngine
{
  public ball: Ball[];
  private gameStatus?: NodeJS.Timeout;
  private lastUpdate: number = 0;

  constructor()
  {
    this.ball = [];

    let ball = new Ball(0,10,3,3);
    this.ball.push(ball);
    let player = new Player(1,CANVAS_HEIGHT/2 , paddleHeight, paddleWidth, CANVAS_HEIGHT ,5, "left");
    let player2 = new Player(2, CANVAS_HEIGHT/2, paddleHeight, paddleWidth, CANVAS_HEIGHT, 5, "right");
    this.ball[0].initNewPlayer(player);
    this.ball[0].initNewPlayer(player2);
  }

  generateBall()
  {
    let ball = new Ball(0,10,3,3);
    this.ball.push(ball);
  }

  generatePlayer(ballID: number)
  {
    let player = new Player(1, 0, 0,0, 0, 0, "left");
    this.ball[ballID].initNewPlayer(player);
  }

  getBallInfo(ballID: number)
  {
    return [this.ball[ballID].ExportBallInfo()];
  }

  lowBot = (player: Player, ball: Ball) => {
    if (player.getPos() + paddleHeight / 2 < ball.getBallY()) 
      player.moveDown();
    else 
    player.moveUp();
  }

  startGameLoop()
  {
    if (this.gameStatus)
      return;
    // console.log(UPDATE_INTERVAL_MS);
      
    this.lastUpdate = Date.now();
    this.gameStatus = setInterval(() => 
    {
      const currentTime = Date.now();
      const deltaTime = currentTime - this.lastUpdate;
      
      if (deltaTime >= UPDATE_INTERVAL_MS) {
        this.ball[0].moveBall();
        this.ball[0].checkCollision();
        // console.log(this.ball[0].getBallX());
        this.lowBot(this.ball[0].players[0], this.ball[0]);
        this.lowBot(this.ball[0].players[1], this.ball[0]);
        this.lastUpdate = currentTime;
      }
    }, UPDATE_INTERVAL_MS);
  }

  stopGameLoop()
  {
    if (this.gameStatus){
      clearInterval(this.gameStatus as NodeJS.Timeout);
      this.gameStatus = undefined;
    }
  }
}

export let Engine = new pongEngine();