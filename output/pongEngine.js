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
        let player0 = new Player_1.Player(0, "pole", paddleHeight, paddleWidth, 600, 5, "left");
        let player1 = new Player_1.Player(1, "jean", paddleHeight, paddleWidth, 600, 5, "right");
        let player2 = new Player_1.Player(2, "pole", paddleHeight, paddleWidth, 600, 5, "left");
        let player3 = new Player_1.Player(3, "jean", paddleHeight, paddleWidth, 600, 5, "right");
        let player4 = new Player_1.Player(4, "pole", paddleHeight, paddleWidth, 600, 5, "left");
        let player5 = new Player_1.Player(5, "jean", paddleHeight, paddleWidth, 600, 5, "right");
        this.ball[0].initNewPlayer(player0);
        this.ball[0].initNewPlayer(player1);
        this.ball[0].initNewPlayer(player2);
        this.ball[0].initNewPlayer(player3);
        this.ball[0].initNewPlayer(player4);
        this.ball[0].initNewPlayer(player5);
    }
    generateBall() {
        let ball = new Ball_1.Ball(0, 10, 3, 3);
        this.ball.push(ball);
    }
    generatePlayer(ballID, args) {
        let player = new Player_1.Player(...args);
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
                // this.lowBot(this.ball[0].players[0], this.ball[0]);
                // this.lowBot(this.ball[0].players[0], this.ball[0]);
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
