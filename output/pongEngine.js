"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Engine = void 0;
const Player_1 = require("./classes/Player");
const Ball_1 = require("./classes/Ball");
let paddleHeight = 100;
class pongEngine {
    constructor() {
        this.lowBot = (player, ball) => {
            if (player.getPos() + paddleHeight / 2 < ball.getBallY())
                player.moveDown();
            else
                player.moveUp();
        };
        this.ball = [];
        let ball = new Ball_1.Ball(0, 10, 11, 10, 3, 3, 500, 400, 10);
        this.ball.push(ball);
        let player = new Player_1.Player(1, 0, 0, 0, 0, "left");
        let player2 = new Player_1.Player(2, 0, 0, 0, 0, "right");
        this.ball[0].initNewPlayer(player);
        this.ball[0].initNewPlayer(player2);
    }
    generateBall() {
        let ball = new Ball_1.Ball(0, 10, 11, 10, 3, 3, 500, 400, 10);
        this.ball.push(ball);
    }
    generatePlayer(ballID) {
        let player = new Player_1.Player(1, 0, 0, 0, 0, "left");
        this.ball[ballID].initNewPlayer(player);
    }
    getBallInfo(ballID) {
        return [this.ball[ballID].ExportBallInfo()];
    }
    startGameLoop() {
        if (this.gameStatus)
            return;
        this.gameStatus = setInterval(() => {
            this.ball[0].moveBall();
            this.ball[0].checkCollision();
        }, 1000 / 60);
    }
    stopGameLoop() {
        if (this.gameStatus)
            clearInterval(this.gameStatus);
    }
}
exports.Engine = new pongEngine();
// Engine.startGameLoop();
