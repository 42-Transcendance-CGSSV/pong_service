
import { Player } from "./classes/Player";
import { Ball } from "./classes/Ball";

let paddleHeight = 100;

class pongEngine
{
  public ball: Ball[];
  private gameStatus?: NodeJS.Timer;

  constructor()
  {
    this.ball = [];

    let ball = new Ball(0,10,11,10,3,3,500,400,10);
    this.ball.push(ball);
    let player = new Player(1, 0, 0, 0, 0, "left");
    let player2 = new Player(2, 0, 0, 0, 0, "right");
    this.ball[0].initNewPlayer(player);
    this.ball[0].initNewPlayer(player2);
  }

 
  generateBall()
  {
    let ball = new Ball(0,10,11,10,3,3,500,400,10);
    this.ball.push(ball);
  }

  generatePlayer(ballID: number)
  {
    let player = new Player(1, 0, 0, 0, 0, "left");
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
    this.gameStatus = setInterval(() => {
      this.ball[0].moveBall();
      this.ball[0].checkCollision();
        
    }, 1000 / 60);
  }

  stopGameLoop()
  {
    if (this.gameStatus)
      clearInterval(this.gameStatus as NodeJS.Timeout);
  }


}

export let Engine = new pongEngine();
// Engine.startGameLoop();