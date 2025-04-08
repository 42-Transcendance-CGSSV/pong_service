import { getRandomColor } from '../utils/getRandomColor';
import { env } from '../utils/environment';
import PlayerInterface from '../interfaces/player.interface';
import { randomUUID } from 'crypto';


class Player implements PlayerInterface {
  public          AI             : boolean = true;
  public          PaddlePos      : number;
  public          moveSpeed      : number;
  public readonly PaddleWidth    : number;
  public readonly PaddleHeight   : number;
  public          numberOfGoals  : number = 0;
  public          currentBellong : number;
  public readonly side           : "right" | "left";
  public readonly PlayerID       : string;
  public readonly PlayerName     : string;
  public readonly playerColor    : string = getRandomColor();
  public          PlayerStats    : PlayerStatsInterface;
    
  constructor(PlayerName: string, currentBellong:number, side: "right" | "left", AI?: boolean) {
    this.currentBellong   = currentBellong;
    this.PlayerID         = randomUUID();
    this.PlayerName       = PlayerName;
    this.PaddlePos        = env.CANVAS_HEIGHT / 2 - env.PLAYER_PADDLE_HEIGHT / 2;
    this.PaddleHeight     = env.PLAYER_PADDLE_HEIGHT;
    this.PaddleWidth      = env.PADDLE_WIDTH;
    this.moveSpeed        = env.PLAYER_MOVE_SPEED * env.TIME_MULTIPLIER;
    this.side             = side;
    this.AI               = AI ?? true;

    this.PlayerStats = {
      bestScore      :null,
      maxWinsInARow  :null,
      maxLosesInARow :null,
      totalGames     :null,
      totalWins      :null,
      totalLoses     :null,
    }
  }
  
  moveUp() {
    if (this.PaddlePos > 0) 
      this.PaddlePos -= this.moveSpeed;
  };
  moveDown() {
    if (this.PaddlePos < env.CANVAS_HEIGHT - this.PaddleHeight) 
      this.PaddlePos += this.moveSpeed;
  }
  getSide() {
    return this.side;
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
    
      return this;
  }
}

export default Player;