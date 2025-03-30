"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ball = void 0;
const constants_1 = require("../utils/constants");
class Ball {
    // private lastToHit       ?:  Player;
    // private maxScore        :   number = 5;
    constructor(ballID, ballRadius, ballSpeedX, ballSpeedY) {
        this.players = [];
        this.canvasWidth = constants_1.CANVAS_WIDTH;
        this.canvasHeight = constants_1.CANVAS_HEIGHT;
        this.ballX = constants_1.CANVAS_WIDTH / 2;
        this.ballY = constants_1.CANVAS_HEIGHT / 2;
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
            this.ballX = this.canvasWidth / 2;
            this.ballY = this.canvasHeight / 2;
            this.ballSpeedX = -this.ballSpeedX;
            this.ballSpeedY = Math.floor(Math.random() * 10) - 5;
            return false;
        }
        for (let i = 0; i < this.players.length; i++) {
            const player = this.players[i];
            // console.log(this.paddleHeight);
            if (player &&
                player.getSide() === "left" &&
                this.ballX - this.ballRadius < player.getPaddleWidth() &&
                this.ballY > player.getPos() &&
                this.ballY < player.getPos() + player.getPaddleHeight()) {
                // console.log(this.ballRadius);
                this.ballSpeedX = -this.ballSpeedX;
                this.ballSpeedX += 1;
                this.ballSpeedY += Math.floor(Math.random() * 10) - 5;
                // this.lastToHit = player;
                break;
            }
            if (player &&
                player.getSide() === "right" &&
                this.ballX + this.ballRadius > this.canvasWidth - player.getPaddleWidth() &&
                this.ballY > player.getPos() &&
                this.ballY < player.getPos() + player.getPaddleHeight()) {
                // console.log(this.ballRadius);
                this.ballSpeedX = -this.ballSpeedX;
                this.ballSpeedX += 1;
                this.ballSpeedY += Math.floor(Math.random() * 10) - 5;
                // console.log(this.ballSpeedX , this.ballSpeedY);
                // this.lastToHit = player;
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
