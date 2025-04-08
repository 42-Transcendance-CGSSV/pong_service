"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pongEngine_1 = require("../pongEngine");
const environment_1 = require("../utils/environment");
class Ball {
    // private maxScore        :   number = 5;
    constructor(ballRadius, ballVelocityX, ballVelocityY) {
        this.ballX = environment_1.env.CANVAS_WIDTH / 2;
        this.ballY = environment_1.env.CANVAS_HEIGHT / 2;
        this.ballRadius = ballRadius;
        this.ballVelocityX = ballVelocityX * environment_1.env.TIME_MULTIPLIER;
        this.ballVelocityY = ballVelocityY * environment_1.env.TIME_MULTIPLIER;
    }
    moveBall() {
        // console.log("Ball position: ", this.ballX, this.ballY);
        this.ballX += this.ballVelocityX;
        this.ballY += this.ballVelocityY;
        if (this.ballY - this.ballRadius < 0 || this.ballY + this.ballRadius > environment_1.env.CANVAS_HEIGHT) {
            this.ballVelocityY = -this.ballVelocityY;
        }
    }
    // importAiActions(_actions: JSON)
    // {
    //   // const data = JSON.parse(JSON.stringify(actions));
    //   // data.
    // }
    checkCollision() {
        if (this.ballX < 0 || this.ballX > environment_1.env.CANVAS_WIDTH) {
            this.ballX = environment_1.env.CANVAS_WIDTH / 2;
            this.ballY = environment_1.env.CANVAS_HEIGHT / 2;
            this.ballVelocityX = 3;
            this.ballVelocityY = 3;
            this.ballVelocityX = -this.ballVelocityX;
            this.ballVelocityY = Math.floor(Math.random() * 10) - 5;
            if (this.lastToHit) {
                this.lastToHit.numberOfGoals++;
                console.log(`player ${this.lastToHit.PlayerName} scored :${this.lastToHit.numberOfGoals}`);
            }
        }
        const playersInGame = pongEngine_1.Engine.getPlayersByBall(this);
        if (!playersInGame) {
            return;
        }
        // console.log("Ball position: ", this.ballX, this.ballY);
        for (const player of playersInGame) {
            if (!player) {
                continue;
            }
            if (player.getSide() === "left" &&
                this.ballX - this.ballRadius < player.getPaddleWidth() &&
                this.ballY > player.getPos() &&
                this.ballY < player.getPos() + player.getPaddleHeight()) {
                this.ballVelocityX = -this.ballVelocityX;
                this.ballVelocityX += 1;
                this.ballVelocityY += Math.floor(Math.random() * 10) - 5;
                this.lastToHit = player;
                break;
            }
            if (player.getSide() === "right" &&
                this.ballX + this.ballRadius > environment_1.env.CANVAS_WIDTH - player.getPaddleWidth() &&
                this.ballY > player.getPos() &&
                this.ballY < player.getPos() + player.getPaddleHeight()) {
                // console.log(this.ballRadius);
                // console.log("hereeee");
                this.ballVelocityX = -this.ballVelocityX;
                this.ballVelocityX += 1;
                this.ballVelocityY += Math.floor(Math.random() * 10) - 5;
                // console.log(this.ballVelocityX , this.ballVelocityY);
                this.lastToHit = player;
                break;
            }
        }
        ;
    }
    ExportBallInfo() {
        return this;
    }
}
exports.default = Ball;
