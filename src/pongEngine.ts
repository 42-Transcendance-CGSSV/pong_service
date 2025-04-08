import { env } from "./utils/environment";

import Player from "./classes/Player";
import Ball   from "./classes/Ball";
import Match from "./classes/Match";
import matchInterface from "./interfaces/match.interface";


class pongEngine
{
  public  matches     : Match[];
  private gameStatus? : NodeJS.Timeout;
  private lastUpdate  : number = 0;

  constructor()
  {
    this.matches = [];

    const player1 = new Player("marc", 0, "left");
    const player2 = new Player("philip", 0, "right");
    let initialMatch = new Match(0, 3);
    initialMatch.initNewPlayer(player1);
    initialMatch.initNewPlayer(player2);

    this.matches.push(initialMatch);
  }

  public getMatchByBall(ball: Ball): Match | null
  {
    for (const match of this.matches)
    {
      // if (!match || match.isExpired())
      if (!match)
        continue;
      if (match.isSameBall(ball))
        return match;
    }
    return null;
  }

  public getPlayersByBall(ball: Ball) : Player[] | null
  {
    let match = this.getMatchByBall(ball);
    // console.log("Players in match: ");
    if (!match)
      return null;
    if (!match.players)
      return null;
    return match.players;
  }

  public generateMatch(matchIndex: number) : Match
  {
    let match = new Match(matchIndex, 3);
    const player1 = new Player("jean marc", matchIndex, "left");
    const player2 = new Player("alex", matchIndex, "right");
    match.initNewPlayer(player1);
    match.initNewPlayer(player2); // TODO: should be done by the client
    this.matches.push(match);
    return match;
  }

  public generatePlayer(PlayerName: string, matchIndex: number,  side: "right" | "left", AI?: boolean) : void
  {
    if (matchIndex >= this.matches.length)
      return;
    if (this.matches[matchIndex].isExpired())
      return;
    let player = new Player(PlayerName, matchIndex, side, AI);
    this.matches[matchIndex].initNewPlayer(player);
  }

  public getmatchInfo(matchID: number) : matchInterface | null
  {
    if (matchID >= this.matches.length)
      return null;
    if (this.matches[matchID].isExpired())
      return null;
    return this.matches[matchID].exportMatchInfo();
  }

  public lowBot = (player: Player) => {
    const match = this.matches.find((match) => match.MatchIndex === player.currentBellong);
    if (!match) {
      console.error("Match not found");
      return;
    }
    if (player.getPos() + player.getPaddleHeight() / 2 < match.ball.ballY)
      player.moveDown();
    else 
    player.moveUp();
  }

  public startGameLoop() : void
  {
    if (this.gameStatus)
      return;
    console.log("Starting game loop");
    this.lastUpdate = Date.now();
    this.gameStatus = setInterval(() => 
    {
      const currentTime = Date.now();
      const deltaTime = currentTime - this.lastUpdate;
      if (deltaTime >= env.UPDATE_INTERVAL_MS) {
        for(const match of this.matches)
          {
            if (match.startedAt === -1)
              continue;
            // console.log(`Delta time: ${deltaTime} update rate ${env.UPDATE_INTERVAL_MS}`);
          match.ball.moveBall();
          match.ball.checkCollision();
          for (const player of match.getPlayersInMatch()) {
            if (player.AI) {
              this.lowBot(player);
            }
          }
        }
        this.lastUpdate = currentTime;
      }
    }, env.UPDATE_INTERVAL_MS);
  }

  public stopGameLoop() : void
  {
    if (this.gameStatus){
      clearInterval(this.gameStatus as NodeJS.Timeout);
      this.gameStatus = undefined;
    }
  }
}
export let Engine = new pongEngine();
Engine.startGameLoop();