import { env } from "../utils/environment";
import BallInterface from "../interfaces/ball.interface";
import Game from "./Game";
import { Engine } from "../pong.engine";
import PlayerInterface from "../interfaces/player.interface";

export class Ball implements BallInterface {
    public ballX: number;
    public ballY: number;
    public ballVelocityX: number;
    public ballVelocityY: number;
    public readonly canvasWidth: number;
    public readonly canvasHeight: number;
    public readonly ballRadius: number;
    // private lastToHit       ?:  Player;
    // private maxScore        :   number = 5;

    public constructor(ballRadius: number, ballVelocityX: number, ballVelocityY: number) {
        this.canvasWidth = env.CANVAS_WIDTH;
        this.canvasHeight = env.CANVAS_HEIGHT;
        this.ballX = env.CANVAS_WIDTH / 2;
        this.ballY = env.CANVAS_HEIGHT / 2;
        this.ballRadius = ballRadius;
        this.ballVelocityX = ballVelocityX * env.TIME_MULTIPLIER;
        this.ballVelocityY = ballVelocityY * env.TIME_MULTIPLIER;
    }

    public moveBall(): void {
        this.ballX += this.ballVelocityX;
        this.ballY += this.ballVelocityY;

        if (this.ballY - this.ballRadius < 0 || this.ballY + this.ballRadius > this.canvasHeight) {
            this.ballVelocityY = -this.ballVelocityY;
        }
    }

    /*importAiActions(_actions: JSON) {
         const data = JSON.parse(JSON.stringify(actions));
         data.
    }*/

    public checkCollision(): boolean {
        if (this.ballX < 0 || this.ballX > this.canvasWidth) {
            this.ballX = this.canvasWidth / 2;
            this.ballY = this.canvasHeight / 2;
            this.ballVelocityX = 3;
            this.ballVelocityY = 3;
            this.ballVelocityX = -this.ballVelocityX;
            this.ballVelocityY = Math.floor(Math.random() * 10) - 5;
            return false;
        }

        const rowGame = Engine.getGameByPlayer(this);
        if (!rowGame) return false;

        const game: Game = rowGame as Game;

        // console.log(this.paddleHeight);
        const player1: PlayerInterface = game.player1;
        const player2: PlayerInterface = game.player2;

        if (
            player1 &&
            player1.side === "left" &&
            this.ballX - this.ballRadius < env.PADDLE_WIDTH &&
            this.ballY > player1.PaddlePos &&
            this.ballY < player1.PaddlePos + env.PADDLE_HEIGHT
        ) {
            // console.log(this.ballRadius);
            this.ballVelocityX = -this.ballVelocityX;
            this.ballVelocityX += 1;
            this.ballVelocityY += Math.floor(Math.random() * 10) - 5;
            // this.lastToHit = player;
        } else if (
            player2 &&
            player2.side === "right" &&
            this.ballX + this.ballRadius > this.canvasWidth - env.PADDLE_WIDTH &&
            this.ballY > player2.PaddlePos &&
            this.ballY < player2.PaddlePos + env.PADDLE_HEIGHT
        ) {
            // console.log(this.ballRadius);
            this.ballVelocityX = -this.ballVelocityX;
            this.ballVelocityX += 1;
            this.ballVelocityY += Math.floor(Math.random() * 10) - 5;
            // console.log(this.ballVelocityX , this.ballVelocityY);
            // this.lastToHit = player;
        }

        return false;
    }

    public ExportBallInfo(): BallInterface {
        return this;
    }
}
