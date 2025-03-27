"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ball = void 0;
const constants_1 = require("../utils/constants");
class Ball {
    constructor(ballID, ballX, ballY, ballRadius, ballSpeedX, ballSpeedY, canvasWidth, canvasHeight, paddleHeight) {
        this.players = [];
        this.maxScore = 5;
        this.paddleHeight = paddleHeight;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.ballX = ballX;
        this.ballY = ballY;
        this.ballRadius = ballRadius;
        this.ballSpeedX = ballSpeedX * constants_1.TIME_MULTIPLIER;
        this.ballSpeedY = ballSpeedY * constants_1.TIME_MULTIPLIER;
        this.ballID = ballID;
    }
    getBallX() {
        return this.ballX;
    }
    getBallY() {
        return this.ballY;
    }
    getBallSpeedX() {
        return this.ballSpeedX;
    }
    getBallSpeedY() {
        return this.ballSpeedY;
    }
    initNewPlayer(player) {
        this.players.push(player);
    }
    moveBall() {
        this.ballX += this.ballSpeedX;
        this.ballY += this.ballSpeedY;
        if (this.ballY - this.ballRadius < 0 || this.ballY + this.ballRadius > this.canvasHeight) {
            this.ballSpeedY = -this.ballSpeedY;
        }
    }
    checkCollision() {
        if (this.ballX < 0 || this.ballX > this.canvasWidth) {
            if (this.lastToHit) {
                this.lastToHit.numberOfGoals++;
                if (this.lastToHit.numberOfGoals >= this.maxScore) {
                    return true;
                }
            }
            this.ballX = this.canvasWidth / 2;
            this.ballY = this.canvasHeight / 2;
            this.ballSpeedX = -this.ballSpeedX;
            this.ballSpeedY = Math.floor(Math.random() * 10) - 5;
            return false;
        }
        for (let i = 0; i < this.players.length; i++) {
            const player = this.players[i];
            if (player &&
                player.getSide() === "left" &&
                this.ballX - this.ballRadius < 10 &&
                this.ballY > player.getPos() &&
                this.ballY < player.getPos() + this.paddleHeight) {
                this.ballSpeedX = -this.ballSpeedX;
                this.ballSpeedX += 1;
                this.ballSpeedY += Math.floor(Math.random() * 10) - 5;
                this.lastToHit = player;
                break;
            }
            if (player &&
                player.getSide() === "right" &&
                this.ballX + this.ballRadius > this.canvasWidth - 10 &&
                this.ballY > player.getPos() &&
                this.ballY < player.getPos() + this.paddleHeight) {
                this.ballSpeedX = -this.ballSpeedX;
                this.ballSpeedX += 1;
                this.ballSpeedY += Math.floor(Math.random() * 10) - 5;
                // console.log(this.ballSpeedX , this.ballSpeedY);
                this.lastToHit = player;
                break;
            }
        }
        ;
        return false;
    }
    ExportBallInfo() {
        let playersStatus = this.players.map((player) => player.ExportPlayerInfo());
        return {
            ballID: this.ballID,
            ballX: this.ballX,
            ballY: this.ballY,
            playersInfo: playersStatus
        };
    }
}
exports.Ball = Ball;
