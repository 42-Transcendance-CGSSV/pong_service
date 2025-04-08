"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.movePlayerDown = exports.movePlayerUP = exports.startGame = exports.stopGame = exports.getPlayerInfo = exports.getMatchInfo = exports.generateNewPlayer = void 0;
const pongEngine_1 = require("../pongEngine");
const generateNewPlayer = (request, reply) => {
    const { PlayerName, currentBelong, side, AI } = request.body;
    if (currentBelong >= pongEngine_1.Engine.matches.length) {
        reply.status(400).send({ success: false, message: "Invalid match index" });
        return;
    }
    if (pongEngine_1.Engine.matches[currentBelong].isExpired()) {
        reply.status(400).send({ success: false, message: "Match expired" });
        return;
    }
    pongEngine_1.Engine.generatePlayer(PlayerName, currentBelong, side, AI);
    reply.status(200).send({ success: true });
};
exports.generateNewPlayer = generateNewPlayer;
const getMatchInfo = (request, reply) => {
    const { MatchID } = request.params;
    const match = pongEngine_1.Engine.matches.find((match) => match.MatchIndex === Number(MatchID));
    if (!match) {
        const NewMatch = pongEngine_1.Engine.generateMatch(Number(MatchID));
        if (!NewMatch) {
            reply.status(500).send({ message: " mach now faund and failed to create new match" });
            return;
        }
        reply.status(200).send(NewMatch.exportMatchInfo());
        return;
    }
    reply.send(match.exportMatchInfo());
};
exports.getMatchInfo = getMatchInfo;
const getPlayerInfo = (request, reply) => {
    const { PlayerID } = request.params;
    for (const match of pongEngine_1.Engine.matches) {
        const player = match.players.find((player) => player.PlayerID === PlayerID);
        if (player) {
            reply.send(player.ExportPlayerInfo());
            return;
        }
    }
    reply.status(404).send({ message: "Player not found" });
};
exports.getPlayerInfo = getPlayerInfo;
const stopGame = (_request, reply) => {
    pongEngine_1.Engine.stopGameLoop();
    reply.send({ success: true });
};
exports.stopGame = stopGame;
const startGame = (_request, reply) => {
    const { MatchIndex } = _request.params;
    const match = pongEngine_1.Engine.matches.find((match) => match.MatchIndex === Number(MatchIndex));
    if (!match) {
        reply.status(400).send({ success: false, message: `Match not found ${MatchIndex}` });
        return;
    }
    match.startedAt = Date.now();
    console.log("Game started");
    reply.send({ success: true });
};
exports.startGame = startGame;
const movePlayerUP = (request, reply) => {
    const { PlayerID } = request.params;
    for (const match of pongEngine_1.Engine.matches) {
        const player = match.players.find((player) => player.PlayerID === PlayerID);
        if (player) {
            reply.send(player.moveUp());
            return;
        }
    }
    reply.status(404).send({ message: "Player not found" });
};
exports.movePlayerUP = movePlayerUP;
const movePlayerDown = (request, reply) => {
    const { PlayerID } = request.params;
    for (const match of pongEngine_1.Engine.matches) {
        const player = match.players.find((player) => player.PlayerID === PlayerID);
        if (player) {
            reply.send(player.moveDown());
            return;
        }
    }
    reply.status(404).send({ message: "Player not found" });
};
exports.movePlayerDown = movePlayerDown;
