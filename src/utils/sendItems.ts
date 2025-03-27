import { Engine } from "../pongEngine";
import {FastifyRequest, FastifyReply } from "fastify";










export const getAllPositions = (_request: FastifyRequest, reply: FastifyReply) => {
    // console.log(Engine.getBallInfo(0));
    reply.send(Engine.getBallInfo(0));
}

export const getPlayerInfo = (request : FastifyRequest , reply: FastifyReply) => {
    const { PlayerID } = request.params as { PlayerID: string };
    const item = Engine.ball[0].players.find((item) => item.getID() === Number(PlayerID));
    console.log("PlayerID from params:", typeof PlayerID, PlayerID);
    console.log(`item ` + item);
    if (item) {
        reply.send(item);
    } else {
        reply.status(404).send({ message: request.params??0 + " " + PlayerID + " Item not found" });
    }
}

export const stopGame = (_request : FastifyRequest , _reply: FastifyReply) => {
    Engine.stopGameLoop();
}

export const startGame = (_request : FastifyRequest , _reply: FastifyReply) => {
    Engine.startGameLoop();
}