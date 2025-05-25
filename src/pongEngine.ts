import {env} from "./utils/environment";
import MatchManager from "./managers/match.manager";

/*import Player from "./classes/Player";
import Match from "./classes/Match";*/


class pongEngine {
    private gameStatus?: NodeJS.Timeout;
    private lastUpdate: number = 0;

    constructor() {
        /*
                const player1 = new Player("marc", 0, "left");
                const player2 = new Player("philip", 0, "right");
                let initialMatch = new Match(0, 3);
                initialMatch.initNewPlayer(player1);
                initialMatch.initNewPlayer(player2);

                this.matches.push(initialMatch);*/
    }

    public startGameLoop(): void {
        if (this.gameStatus)
            return;
        console.log("Starting game loop");
        this.lastUpdate = Date.now();
        this.gameStatus = setInterval(() => {
            const currentTime = Date.now();
            const deltaTime = currentTime - this.lastUpdate;
            if (deltaTime >= env.UPDATE_INTERVAL_MS) {
                for (const match of MatchManager.getInstance().matches) {
                    if (!match.isRunning)
                        continue;

                    match.ball.moveBall();
                    match.ball.checkCollision();
                    match.checkForWinner();
                    // for (const player of match.getPlayersInMatch()) {
                    //   if (player.AI) {
                    //     this.lowBot(player);
                    //   }
                    // }
                }
                this.lastUpdate = currentTime;
            }
        }, env.UPDATE_INTERVAL_MS);
    }

    public stopGameLoop(): void {
        if (this.gameStatus) {
            clearInterval(this.gameStatus as NodeJS.Timeout);
            this.gameStatus = undefined;
        }
    }
}

export let Engine = new pongEngine();