"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getRandomColor_1 = require("../utils/getRandomColor");
const environment_1 = require("../utils/environment");
const crypto_1 = require("crypto");
class Player {
    constructor(PlayerName, currentBellong, side, AI) {
        this.numberOfGoals = 0;
        this.playerColor = (0, getRandomColor_1.getRandomColor)();
        this.AI = true;
        this.currentBellong = currentBellong;
        this.PlayerID = (0, crypto_1.randomUUID)();
        this.PlayerName = PlayerName;
        this.PaddlePos = environment_1.env.CANVAS_HEIGHT / 2 - environment_1.env.PLAYER_PADDLE_HEIGHT / 2;
        this.PaddleHeight = environment_1.env.PLAYER_PADDLE_HEIGHT;
        this.PaddleWidth = environment_1.env.PADDLE_WIDTH;
        this.moveSpeed = environment_1.env.PLAYER_MOVE_SPEED * environment_1.env.TIME_MULTIPLIER;
        this.side = side;
        this.AI = AI !== null && AI !== void 0 ? AI : true;
    }
    getSide() {
        return this.side;
    }
    moveUp() {
        if (this.PaddlePos > 0)
            this.PaddlePos -= this.moveSpeed;
    }
    ;
    moveDown() {
        if (this.PaddlePos < environment_1.env.CANVAS_HEIGHT - this.PaddleHeight)
            this.PaddlePos += this.moveSpeed;
    }
    getID() {
        return this.PlayerID;
    }
    getPos() {
        return this.PaddlePos;
    }
    getPaddleHeight() {
        return this.PaddleHeight;
    }
    getPaddleWidth() {
        return this.PaddleWidth;
    }
    ExportPlayerInfo() {
        return this;
    }
}
exports.default = Player;
