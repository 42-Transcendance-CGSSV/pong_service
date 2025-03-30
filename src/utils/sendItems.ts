import { Engine } from "../pongEngine";
import {FastifyRequest, FastifyReply } from "fastify";










export const getAllPositions = (_request: FastifyRequest, reply: FastifyReply) => {
    // console.log(Engine.getBallInfo(0));
    reply.send(Engine.getBallInfo(0));
}

export const getPlayerInfo = (request : FastifyRequest , reply: FastifyReply) => {
    const { PlayerID } = request.params as { PlayerID: string };
    const player = Engine.ball[0].players.find((player) => player.getID() === Number(PlayerID));

    if (player) {
        reply.send(player);
    } else {
        reply.status(404).send({ message: request.params??0 + " " + PlayerID + " player not found" });
    }
}

export const stopGame = (_request : FastifyRequest , _reply: FastifyReply) => {
    Engine.stopGameLoop();
}

export const startGame = (_request : FastifyRequest , _reply: FastifyReply) => {
    Engine.startGameLoop();
}

export const movePlayerUP = (request : FastifyRequest , reply: FastifyReply) => {
    const { PlayerID } = request.params as { PlayerID: string };
    const player = Engine.ball[0].players.find((player) => player.getID() === Number(PlayerID));
    
    if (player) {
        player.moveUp();
        reply.send({ success: true });
    } else {
        reply.status(404).send({ success: false, message: "Player not found" });
    }
}

export const movePlayerDown = (request : FastifyRequest , reply: FastifyReply) => {
    const { PlayerID } = request.params as { PlayerID: string };
    const player = Engine.ball[0].players.find((player) => player.getID() === Number(PlayerID));
    
    if (player) {
        player.moveDown();
        reply.send({ success: true });
    } else {
        reply.status(404).send({ success: false, message: "Player not found" });
    }
}