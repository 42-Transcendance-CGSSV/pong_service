"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const getRandomColor_1 = require("../utils/getRandomColor");
dotenv_1.default.config();
let timeMultiplier = Number(process.env.TIME_MULTIPLIER);
class Player {
    // public AI?: AI = undefined;
    constructor(playerID, PaddlePos, PaddleHeight, PaddleWidth, canvasHeight, moveSpeed, side) {
        this.numberOfGoals = 0;
        this.playerColor = (0, getRandomColor_1.getRandomColor)();
        this.PlayerID = playerID;
        this.PaddlePos = PaddlePos;
        this.PaddleHeight = PaddleHeight;
        this.PaddleWidth = PaddleWidth;
        this.canvasHeight = canvasHeight;
        this.moveSpeed = moveSpeed * timeMultiplier;
        this.side = side;
        //   this.AI = AI;
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
        if (this.PaddlePos < this.canvasHeight - this.PaddleHeight)
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
        return ({
            PlayerID: this.PlayerID,
            PaddlePos: this.PaddlePos,
            PaddleHeight: this.PaddleHeight,
            canvasHeight: this.canvasHeight,
            moveSpeed: this.moveSpeed,
            side: this.side,
            numberOfGoals: this.numberOfGoals,
            playerColor: this.playerColor
        });
    }
}
exports.Player = Player;
