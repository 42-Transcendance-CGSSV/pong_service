// import { request } from "http";
import { Engine } from "../pongEngine";
import {FastifyRequest, FastifyReply } from "fastify";
import { PlayerArgs } from "../classes/Player";


export const generateNewPlayer = (request : FastifyRequest , reply: FastifyReply) => {
    const { playerID, PlayerName, PaddleHeight, PaddleWidth, canvasHeight, moveSpeed, side } = request.body as {
        playerID: number;
        PlayerName: string;
        PaddleHeight: number;
        PaddleWidth: number;
        canvasHeight: number;
        moveSpeed: number;
        side: "right" | "left";
    };
    const tmpARGS: PlayerArgs = [playerID, PlayerName, PaddleHeight, PaddleWidth, canvasHeight, moveSpeed, side];

    Engine.generatePlayer(0, tmpARGS);
    reply.status(200).send({ success: true });
}






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