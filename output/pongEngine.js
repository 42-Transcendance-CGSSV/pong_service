"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Engine = void 0;
const environment_1 = require("./utils/environment");
const Player_1 = __importDefault(require("./classes/Player"));
const Match_1 = __importDefault(require("./classes/Match"));
class pongEngine {
    constructor() {
        this.lastUpdate = 0;
        this.lowBot = (player) => {
            const match = this.matches.find((match) => match.MatchIndex === player.currentBellong);
            if (!match) {
                console.error("Match not found");
                return;
            }
            if (player.getPos() + player.getPaddleHeight() / 2 < match.ball.ballY)
                player.moveDown();
            else
                player.moveUp();
        };
        this.matches = [];
        const player1 = new Player_1.default("marc", 0, "left");
        const player2 = new Player_1.default("philip", 0, "right");
        let initialMatch = new Match_1.default(0, 3);
        initialMatch.initNewPlayer(player1);
        initialMatch.initNewPlayer(player2);
        this.matches.push(initialMatch);
    }
    getMatchByBall(ball) {
        for (const match of this.matches) {
            // if (!match || match.isExpired())
            if (!match)
                continue;
            if (match.isSameBall(ball))
                return match;
        }
        return null;
    }
    getPlayersByBall(ball) {
        let match = this.getMatchByBall(ball);
        // console.log("Players in match: ");
        if (!match)
            return null;
        if (!match.players)
            return null;
        return match.players;
    }
    generateMatch(matchIndex) {
        let match = new Match_1.default(matchIndex, 3);
        const player1 = new Player_1.default("jean marc", matchIndex, "left");
        const player2 = new Player_1.default("alex", matchIndex, "right");
        match.initNewPlayer(player1);
        match.initNewPlayer(player2); // TODO: should be done by the client
        this.matches.push(match);
        return match;
    }
    generatePlayer(PlayerName, matchIndex, side, AI) {
        if (matchIndex >= this.matches.length)
            return;
        if (this.matches[matchIndex].isExpired())
            return;
        let player = new Player_1.default(PlayerName, matchIndex, side, AI);
        this.matches[matchIndex].initNewPlayer(player);
    }
    getmatchInfo(matchID) {
        if (matchID >= this.matches.length)
            return null;
        if (this.matches[matchID].isExpired())
            return null;
        return this.matches[matchID].exportMatchInfo();
    }
    startGameLoop() {
        if (this.gameStatus)
            return;
        console.log("Starting game loop");
        this.lastUpdate = Date.now();
        this.gameStatus = setInterval(() => {
            const currentTime = Date.now();
            const deltaTime = currentTime - this.lastUpdate;
            if (deltaTime >= environment_1.env.UPDATE_INTERVAL_MS) {
                for (const match of this.matches) {
                    if (match.startedAt === -1)
                        continue;
                    // console.log(`Delta time: ${deltaTime} update rate ${env.UPDATE_INTERVAL_MS}`);
                    match.ball.moveBall();
                    match.ball.checkCollision();
                    for (const player of match.getPlayersInMatch()) {
                        if (player.AI) {
                            this.lowBot(player);
                        }
                    }
                }
                this.lastUpdate = currentTime;
            }
        }, environment_1.env.UPDATE_INTERVAL_MS);
    }
    stopGameLoop() {
        if (this.gameStatus) {
            clearInterval(this.gameStatus);
            this.gameStatus = undefined;
        }
    }
}
exports.Engine = new pongEngine();
exports.Engine.startGameLoop();
