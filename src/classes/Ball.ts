import {env} from "../utils/environment";
import Player from "./Player";

import BallInterface from "../interfaces/ball.interface";
import MatchManager from "../managers/match.manager";
import {normalizePosition} from "../utils/maths";


class Ball implements BallInterface {
    public ballX: number;
    public ballY: number;
    public ballVelocityX: number;
    public ballVelocityY: number;
    public ballRadius: number;
    public lastToHit                ?: Player;

    constructor(ballRadius: number, ballVelocityX: number, ballVelocityY: number) {
        this.ballX = env.CANVAS_WIDTH / 2;
        this.ballY = env.CANVAS_HEIGHT / 2;
        this.ballRadius = ballRadius;
        this.ballVelocityX = ballVelocityX * env.TIME_MULTIPLIER;
        this.ballVelocityY = ballVelocityY * env.TIME_MULTIPLIER;
    }

    public moveBall(): void {
        this.ballX += this.ballVelocityX;
        this.ballY += this.ballVelocityY;

        if (this.ballY - this.ballRadius < 0 || this.ballY + this.ballRadius > env.CANVAS_HEIGHT) {
            this.ballVelocityY = -this.ballVelocityY;
        }
    }

    public checkCollision(): void {
        if (this.ballX < 0 || this.ballX > env.CANVAS_WIDTH) {
            this.ballX = env.CANVAS_WIDTH / 2;
            this.ballY = env.CANVAS_HEIGHT / 2;
            this.ballVelocityX = 40;
            this.ballVelocityY = 40;
            this.ballVelocityX = -this.ballVelocityX;
            this.ballVelocityY = Math.floor(Math.random() * 10) - 5;
            if (this.lastToHit) {
                this.lastToHit.score++;
                console.log(`player ${this.lastToHit.PlayerName} scored :${this.lastToHit.score}`);
                this.lastToHit = undefined;
            }
        }

        const playersInGame = MatchManager.getInstance().getPlayersByBall(this);
        if (!playersInGame) {
            return;
        }

        for (const player of playersInGame) {
            if (!player) {
                continue;
            }
            if (player !== this.lastToHit &&
                player.getSide() === "left" &&
                this.ballX - this.ballRadius < player.getPaddleWidth() &&
                this.ballY > player.getPos() &&
                this.ballY < player.getPos() + player.getPaddleHeight()) {

                this.ballVelocityX -= 2;
                this.ballVelocityX = -this.ballVelocityX;
                this.ballVelocityY +=  2;
                // this.ballVelocityY = this.ballVelocityY > 0 ? this.ballVelocityY : -this.ballVelocityY;
                this.lastToHit = player;
                // console.log("left",this.ballVelocityX, this.ballVelocityY);
                break;
            }
            if (player !== this.lastToHit &&
                player.getSide() === "right" &&
                this.ballX + this.ballRadius > env.CANVAS_WIDTH - player.getPaddleWidth() &&
                this.ballY > player.getPos() &&
                this.ballY < player.getPos() + player.getPaddleHeight()) {
                // console.log(this.ballRadius);
                // console.log("hereeee");
                this.ballVelocityX += 2;
                this.ballVelocityX = -this.ballVelocityX;
                this.ballVelocityY += 2;
                // this.ballVelocityY = this.ballVelocityY > 0 ? this.ballVelocityY : -this.ballVelocityY;
                this.lastToHit = player;
                // console.log("right ",this.ballVelocityX, this.ballVelocityY);
                break;
            }
        }
    }

    public ExportBallInfo() {
        return {
            ballRadius: this.ballRadius,
            relativeBallX: normalizePosition(this.ballX, env.CANVAS_WIDTH, 0),
            relativeBallY: normalizePosition(this.ballY, env.CANVAS_HEIGHT, 0),
            ballSpeedY: this.ballVelocityY,
            ballSpeedX: this.ballVelocityX,
        };
    }
}

export default Ball;