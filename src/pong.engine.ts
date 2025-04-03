import { Player } from "./classes/Player";
import { Ball } from "./classes/Ball";
import { env } from "./utils/environment";
import Game from "./classes/Game";

class PongEngine {
    public games: Game[];
    private gameStatus?: NodeJS.Timeout;
    private lastUpdate: number = 0;

    public constructor() {
        this.games = [];

        const player0 = new Player(0, "pole", 600, 5, "left");
        const player1 = new Player(1, "jean", 600, 5, "right");
        // const player2 = new Player(2, "pole", 600, 5, "left");
        // const player3 = new Player(3, "jean", 600, 5, "right");
        // const player4 = new Player(4, "pole", 600, 5, "left");
        // const player5 = new Player(5, "jean", 600, 5, "right");

        const game = new Game(player0, player1, 100);
        this.games.push(game);

        // this.ball[0].initNewPlayer(player2);
        // this.ball[0].initNewPlayer(player3);
        // this.ball[0].initNewPlayer(player4);
        // this.ball[0].initNewPlayer(player5);
    }

    public getGameByPlayer(ball: Ball): Game | null {
        for (const game of this.games) {
            if (!game || game.isExpired()) continue;
            if (game.isSameBall(ball)) return game;
        }
        return null;
    }

    public lowBot = (player: Player, ball: Ball): void => {
        if (player.PaddlePos + env.PADDLE_HEIGHT / 2 < ball.ballY) player.moveDown();
        else player.moveUp();
    };

    public startGameLoop(): void {
        if (this.gameStatus) return;

        this.lastUpdate = Date.now();
        this.gameStatus = setInterval(() => {
            for (const game of this.games) {
                const currentTime = Date.now();
                const deltaTime = currentTime - this.lastUpdate;

                if (deltaTime >= env.UPDATE_INTERVAL_MS) {
                    game.ball.moveBall();
                    game.ball.checkCollision();
                    /*console.log(this.ball[0].getBallX());
                    this.lowBot(this.ball[0].players[0], this.ball[0]);
                    this.lowBot(this.ball[0].players[0], this.ball[0]);*/
                    this.lastUpdate = currentTime;
                }
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

export const Engine = new PongEngine();
