// import { request } from "http";
import { Engine } from "../pong.engine";
import { FastifyReply, FastifyRequest } from "fastify";
import { Player } from "../classes/Player";
import { ApiError, ApiErrorCode } from "./errors.util";

export function generateNewPlayer(request: FastifyRequest, reply: FastifyReply): void {
    const playerInRequest = request.body as Player;
    Engine.generatePlayer(playerInRequest);
    reply.status(200).send({ success: true });
}

export function getAllPositions(_request: FastifyRequest, reply: FastifyReply): void {
    // console.log(Engine.getBallInfo(0));
    //TODO: CHANGE THIS
    reply.send(Engine.getBallInfo(0));
}

export function getPlayerInfo(request: FastifyRequest, reply: FastifyReply): void {
    const { PlayerID } = request.params as { PlayerID: string };
    const player = Engine.ball[0].players.find((player) => player.PlayerID === Number(PlayerID));

    if (player) {
        reply.send(player);
    } else {
        reply.status(404).send({ message: request.params ?? 0 + " " + PlayerID + " player not found" });
    }
}

export function stopGame(_request: FastifyRequest, _reply: FastifyReply): void {
    Engine.stopGameLoop();
}

export function startGame(_request: FastifyRequest, _reply: FastifyReply): void {
    Engine.startGameLoop();
}

export function movePlayerUP(request: FastifyRequest, reply: FastifyReply): void {
    const { PlayerID } = request.params as { PlayerID: string };
    const player = Engine.ball[0].players.find((player) => player.PlayerID === Number(PlayerID));

    if (player) {
        player.moveUp();
        reply.send({ success: true });
        return;
    }
    throw new ApiError(ApiErrorCode.USER_NOT_FOUND, "Player not found !");
}

export function movePlayerDown(request: FastifyRequest, reply: FastifyReply): void {
    const { PlayerID } = request.params as { PlayerID: string };
    const player = Engine.ball[0].players.find((player) => player.PlayerID === Number(PlayerID));

    if (player) {
        player.moveDown();
        reply.send({ success: true });
    } else {
        reply.status(404).send({ success: false, message: "Player not found" });
    }
}
