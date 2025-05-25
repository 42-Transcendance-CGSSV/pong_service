import {Engine} from "../pongEngine";
import {FastifyRequest, FastifyReply} from "fastify";
import {IBasicResponse} from "../interfaces/response.interface";


export const generateNewPlayer = (request: FastifyRequest, reply: FastifyReply) => {
    const {PlayerName, currentBelong, side, AI} = request.body as {
        PlayerName: string;
        currentBelong: number;
        side: "right" | "left";
        AI?: boolean;
    };
    if (currentBelong >= Engine.matches.length) {
        reply.status(400).send({success: false, message: "Invalid match index"});
        return;
    }
    if (Engine.matches[currentBelong].isExpired()) {
        reply.status(400).send({success: false, message: "Match expired"});
        return;
    }
    Engine.generatePlayer(PlayerName, currentBelong, side, AI);
    reply.status(200).send({success: true});
}


export const getMatchInfo = (request: FastifyRequest, reply: FastifyReply) => {
    const {MatchID} = request.params as { MatchID: string };
    const match = Engine.matches.find((match) => match.MatchIndex === Number(MatchID));
    if (!match) {
        const NewMatch = Engine.generateMatch(Number(MatchID));
        if (!NewMatch) {
            reply.status(501).send({message: " mach now faund and failed to create new match"});
            return;
        }
        reply.status(200).send(NewMatch.exportMatchInfo());
        return;
    }
    reply.send(match.exportMatchInfo());
}


export const getPlayerInfo = (request: FastifyRequest, reply: FastifyReply) => {
    const {PlayerID} = request.params as { PlayerID: string };

    for (const match of Engine.matches) {
        const player = match.players.find((player) => player.PlayerID === PlayerID);
        if (player) {
            reply.send(player.ExportPlayerInfo());
            return;
        }
    }
    reply.status(404).send({message: "Player not found"});
}


export const pauseGame = (_request: FastifyRequest, reply: FastifyReply) => {
    const {MatchIndex} = _request.params as { MatchIndex: string };
    const match = Engine.matches.find((match) => match.MatchIndex === Number(MatchIndex));
    if (!match) {
        reply.status(400).send({success: false, message: `Match not found ${MatchIndex}`});
        return;
    }
    match.endedAt = Date.now();
    match.isRunning = false;
    console.log(`Game ${MatchIndex} stoped`);
    reply.send({success: true})
}

export const playGame = (_request: FastifyRequest, reply: FastifyReply) => {
    const {MatchIndex} = _request.params as { MatchIndex: string };
    const match = Engine.matches.find((match) => match.MatchIndex === Number(MatchIndex));
    if (!match) {
        reply.status(400).send({success: false, message: `Match not found ${MatchIndex}`});
        return;
    }
    match.startedAt = Date.now();
    match.isRunning = true;
    console.log(`Game ${MatchIndex} started`);
    reply.send({success: true})
}


export function movePaddle(PlayerID: string, direction: "up" | "down"): IBasicResponse {

    for (const match of Engine.matches) {
        const player = match.players.find((player) => player.PlayerID === PlayerID);
        if (player) {
            direction === "down" ? player.moveDown() : player.moveUp();
            return {success: true, message: "Paddle has been moved " + direction} as IBasicResponse;
        }
    }
    return {success: false, message: "The player is not in a game !"} as IBasicResponse;
}

export const movePlayerDown = (request: FastifyRequest, reply: FastifyReply) => {
    const {PlayerID} = request.params as { PlayerID: string };

    for (const match of Engine.matches) {
        const player = match.players.find((player) => player.PlayerID === PlayerID);
        if (player) {
            reply.send(player.moveDown());
            return;
        }
    }
    reply.status(404).send({message: "Player not found"});
}