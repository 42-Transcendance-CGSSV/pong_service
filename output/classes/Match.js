"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const Ball_1 = __importDefault(require("./Ball"));
class Match {
    constructor(matchIndex, scoreGoal) {
        this.players = [];
        this.MatchIndex = matchIndex;
        this.ball = new Ball_1.default(10, 3, 3);
        this.scoreGoal = scoreGoal;
        this.startedAt = -1;
        this.endedAt = -1;
        this.winnerId = "";
        this.matchID = (0, crypto_1.randomUUID)();
    }
    initNewPlayer(player) {
        if (this.players.length >= 2) {
            throw new Error("Match is full");
        }
        this.players.push(player);
    }
    getPlayersInMatch() {
        return this.players;
    }
    isExpired() {
        return this.startedAt + 60 * 60000 > Date.now();
    }
    isSameBall(ball) {
        return ball === this.ball;
    }
    exportMatchInfo() {
        return this;
    }
}
exports.default = Match;
