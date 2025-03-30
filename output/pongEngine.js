"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Engine = void 0;
const Player_1 = require("./classes/Player");
const Ball_1 = require("./classes/Ball");
const constants_1 = require("./utils/constants");
let paddleHeight = 80;
let paddleWidth = 10;
class pongEngine {
    constructor() {
        this.lastUpdate = 0;
        this.lowBot = (player, ball) => {
            if (player.getPos() + paddleHeight / 2 < ball.getBallY())
                player.moveDown();
            else
                player.moveUp();
        };
        this.ball = [];
        let ball = new Ball_1.Ball(0, 10, 3, 3);
        this.ball.push(ball);
        let player = new Player_1.Player(1, constants_1.CANVAS_HEIGHT / 2, paddleHeight, paddleWidth, constants_1.CANVAS_HEIGHT, 5, "left");
        let player2 = new Player_1.Player(2, constants_1.CANVAS_HEIGHT / 2, paddleHeight, paddleWidth, constants_1.CANVAS_HEIGHT, 5, "right");
        this.ball[0].initNewPlayer(player);
        this.ball[0].initNewPlayer(player2);
    }
    generateBall() {
        let ball = new Ball_1.Ball(0, 10, 3, 3);
        this.ball.push(ball);
    }
    generatePlayer(ballID) {
        let player = new Player_1.Player(1, 0, 0, 0, 0, 0, "left");
        this.ball[ballID].initNewPlayer(player);
    }
    getBallInfo(ballID) {
        return [this.ball[ballID].ExportBallInfo()];
    }
    startGameLoop() {
        if (this.gameStatus)
            return;
        // console.log(UPDATE_INTERVAL_MS);
        this.lastUpdate = Date.now();
        this.gameStatus = setInterval(() => {
            const currentTime = Date.now();
            const deltaTime = currentTime - this.lastUpdate;
            if (deltaTime >= constants_1.UPDATE_INTERVAL_MS) {
                this.ball[0].moveBall();
                this.ball[0].checkCollision();
                // console.log(this.ball[0].getBallX());
                this.lowBot(this.ball[0].players[0], this.ball[0]);
                this.lowBot(this.ball[0].players[1], this.ball[0]);
                this.lastUpdate = currentTime;
            }
        }, constants_1.UPDATE_INTERVAL_MS);
    }
    stopGameLoop() {
        if (this.gameStatus) {
            clearInterval(this.gameStatus);
            this.gameStatus = undefined;
        }
    }
}
exports.Engine = new pongEngine();
