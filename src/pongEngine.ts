import { Player , PlayerArgs} from "./classes/Player";
import { Ball } from "./classes/Ball";
import {UPDATE_INTERVAL_MS} from "./utils/constants";

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
    let player0 = new Player(0,"pole", paddleHeight, paddleWidth, 600 ,5, "left");
    let player1 = new Player(1,"jean", paddleHeight, paddleWidth, 600, 5, "right");
    let player2 = new Player(2,"pole", paddleHeight, paddleWidth, 600 ,5, "left");
    let player3 = new Player(3,"jean", paddleHeight, paddleWidth, 600, 5, "right");
    let player4 = new Player(4,"pole", paddleHeight, paddleWidth, 600 ,5, "left");
    let player5 = new Player(5,"jean", paddleHeight, paddleWidth, 600, 5, "right");

    this.ball[0].initNewPlayer(player0);
    this.ball[0].initNewPlayer(player1);
    this.ball[0].initNewPlayer(player2);
    this.ball[0].initNewPlayer(player3);
    this.ball[0].initNewPlayer(player4);
    this.ball[0].initNewPlayer(player5);
  }

  generateBall()
  {
    let ball = new Ball(0,10,3,3);
    this.ball.push(ball);
  }

  generatePlayer(ballID: number, args: PlayerArgs)
  {
    let player = new Player(...args);
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
        // this.lowBot(this.ball[0].players[0], this.ball[0]);
        // this.lowBot(this.ball[0].players[0], this.ball[0]);
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