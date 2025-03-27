"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startGame = exports.stopGame = exports.getPlayerInfo = exports.getAllPositions = void 0;
const pongEngine_1 = require("../pongEngine");
const getAllPositions = (_request, reply) => {
    // console.log(Engine.getBallInfo(0));
    reply.send(pongEngine_1.Engine.getBallInfo(0));
};
exports.getAllPositions = getAllPositions;
const getPlayerInfo = (request, reply) => {
    var _a;
    const { PlayerID } = request.params;
    const item = pongEngine_1.Engine.ball[0].players.find((item) => item.getID() === Number(PlayerID));
    console.log("PlayerID from params:", typeof PlayerID, PlayerID);
    console.log(`item ` + item);
    if (item) {
        reply.send(item);
    }
    else {
        reply.status(404).send({ message: (_a = request.params) !== null && _a !== void 0 ? _a : 0 + " " + PlayerID + " Item not found" });
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
