"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.movePlayerDown = exports.movePlayerUP = exports.startGame = exports.stopGame = exports.getPlayerInfo = exports.getAllPositions = exports.generateNewPlayer = void 0;
// import { request } from "http";
const pongEngine_1 = require("../pongEngine");
const generateNewPlayer = (request, reply) => {
    const { playerID, PlayerName, PaddleHeight, PaddleWidth, canvasHeight, moveSpeed, side } = request.body;
    const tmpARGS = [playerID, PlayerName, PaddleHeight, PaddleWidth, canvasHeight, moveSpeed, side];
    pongEngine_1.Engine.generatePlayer(0, tmpARGS);
    reply.status(200).send({ success: true });
};
exports.generateNewPlayer = generateNewPlayer;
const getAllPositions = (_request, reply) => {
    // console.log(Engine.getBallInfo(0));
    reply.send(pongEngine_1.Engine.getBallInfo(0));
};
exports.getAllPositions = getAllPositions;
const getPlayerInfo = (request, reply) => {
    var _a;
    const { PlayerID } = request.params;
    const player = pongEngine_1.Engine.ball[0].players.find((player) => player.getID() === Number(PlayerID));
    if (player) {
        reply.send(player);
    }
    else {
        reply.status(404).send({ message: (_a = request.params) !== null && _a !== void 0 ? _a : 0 + " " + PlayerID + " player not found" });
    }
};
exports.getPlayerInfo = getPlayerInfo;
const stopGame = (_request, _reply) => {
    pongEngine_1.Engine.stopGameLoop();
};
exports.stopGame = stopGame;
const startGame = (_request, _reply) => {
    pongEngine_1.Engine.startGameLoop();
};
exports.startGame = startGame;
const movePlayerUP = (request, reply) => {
    const { PlayerID } = request.params;
    const player = pongEngine_1.Engine.ball[0].players.find((player) => player.getID() === Number(PlayerID));
    if (player) {
        player.moveUp();
        reply.send({ success: true });
    }
    else {
        reply.status(404).send({ success: false, message: "Player not found" });
    }
};
exports.movePlayerUP = movePlayerUP;
const movePlayerDown = (request, reply) => {
    const { PlayerID } = request.params;
    const player = pongEngine_1.Engine.ball[0].players.find((player) => player.getID() === Number(PlayerID));
    if (player) {
        player.moveDown();
        reply.send({ success: true });
    }
    else {
        reply.status(404).send({ success: false, message: "Player not found" });
    }
};
exports.movePlayerDown = movePlayerDown;
