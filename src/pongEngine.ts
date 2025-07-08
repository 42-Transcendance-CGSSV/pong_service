import {env} from "./utils/environment";
import MatchManager from "./managers/match.manager";
import {app} from "./app";

/*import Player from "./classes/Player";
import Match from "./classes/Match";*/


class PongEngine {
    private static instance: PongEngine | null = null;
    private gameStatus?: NodeJS.Timeout;
    private lastUpdate: number = 0;

    public static getInstance(): PongEngine {
        if (this.instance === null) this.instance = new PongEngine();
        return this.instance;
    }

    public startGameLoop(): void {
        if (this.gameStatus)
            return;
        app.log.info("Starting game loop");
        this.lastUpdate = Date.now();
        this.gameStatus = setInterval(() => {
            const currentTime = Date.now();
            const deltaTime = currentTime - this.lastUpdate;
            if (deltaTime >= env.UPDATE_INTERVAL_MS) {
                for (const match of MatchManager.getInstance().matches.values()) {
                    if (!match.isRunning)
                        continue;
                    match.ball.moveBall();
                    match.checkForWinner();
                }
                this.lastUpdate = currentTime;
            }
        }, 17);
    }

    public stopGameLoop(): void {
        if (this.gameStatus) {
            clearInterval(this.gameStatus as NodeJS.Timeout);
            this.gameStatus = undefined;
        }
    }
}

export default PongEngine;