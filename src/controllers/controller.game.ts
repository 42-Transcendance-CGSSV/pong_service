import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";

import MatchManager from "../managers/match.manager";
import initPlayerSchemas from "../schemas/gen.player.schema";
import schemas from "fluent-json-schema";
import {getMatchById, startMatch} from "../services/match.service";
import ApiError, {ApiErrorCode} from "../utils/error.util";
import {ISuccessResponse} from "../interfaces/response.interface";
import {toCamelCase, toSnakeCase} from "../utils/case.util";
import {env} from "../utils/environment";
import WebsocketsManager from "../managers/websockets.manager";
import {setInterval} from "node:timers";
import Player from "../classes/Player";
import {app} from "../app";
import Match from "../classes/Match";


export function pongController(fastify: FastifyInstance, _options: any, done: () => void) {

    fastify.put("/match", {
        schema: {
            body: schemas.object()
                .prop("first_user", initPlayerSchemas)
                .prop("second_user", initPlayerSchemas)
                .prop("backend_token", schemas.string().required())
        },
        handler: async (request: FastifyRequest, reply: FastifyReply) => {
            const body = toCamelCase(request.body);
            if (body.backendToken !== env.BACKEND_TOKEN) throw new ApiError(ApiErrorCode.INSUFFICIENT_PERMISSIONS, "internal route");

            const firstUser = toCamelCase(body.firstUser);
            const secondUser = toCamelCase(body.secondUser);

            const matchManager = MatchManager.getInstance();

            if (matchManager.getMatchByPlayerId(firstUser.userId) && !firstUser.isAi)
                throw new ApiError(ApiErrorCode.DUPLICATE_RESOURCE, `${firstUser} is already in match`);
            if (matchManager.getMatchByPlayer(secondUser.userId) && !secondUser.isAi)
                throw new ApiError(ApiErrorCode.DUPLICATE_RESOURCE, `${secondUser} is already in match`);

            const playerOne = matchManager.createPlayer(firstUser.userId, firstUser.isAi, firstUser.isTraining, 0);
            const playerTwo = matchManager.createPlayer(secondUser.userId, secondUser.isAi, secondUser.isTraining, 1);
            const match = matchManager.createMatch(1100, playerOne, playerTwo);

            let players: Player[] = match.getOnlinePlayerInMatch();
            const hasAI = players.some(p => p.AI);
            if (hasAI) {
                playerTwo.ready = true;
            }

            reply.send({
                success: true,
                message: hasAI ? "AI Match created successfully" : "The match has been created !",
                data: toSnakeCase(match)
            } as ISuccessResponse);


            let delay = 35;
            const timer = setInterval(() => {
                players = match.getOnlinePlayerInMatch();
                if (players.length < 2) {
                    app.log.debug(`Match ${match.matchId} has ${players.length} players in match. ALT : ${match.getPlayersInMatch().length}`);
                    return;
                }

                if (hasAI) {
                    const playerSocket = WebsocketsManager.getInstance().getSocketFromUserId(playerOne.playerId);
                    if (playerSocket) {
                        playerSocket.send(JSON.stringify({
                            channel: "ready-player",
                            data: {user_id: playerTwo.playerId}
                        }))
                    }
                }

                const isReady = players.every(p => p.ready);

                app.log.debug(`Match ${match.matchId} waiting for ${delay} seconds`);

                if (isReady && delay >= 6) {
                    delay = 5;
                    return;
                }

                delay--;

                if (delay >= 0) {
                    players.forEach((player: Player) => {
                        const playerSocket = WebsocketsManager.getInstance().getSocketFromUserId(player.playerId);
                        if (!playerSocket) return;
                        playerSocket.send(JSON.stringify({
                            channel: "waiting-start",
                            data: {time_remaining: delay}
                        }))
                    })
                    if (delay === 0) {
                        start(match, players);
                        timer.close();
                        return;
                    }
                }
            }, 1000);
        }
    });

    fastify.get("/match", {
            schema: {params: schemas.object().prop("match_id", schemas.number().minimum(1).required())},
            handler: (request: FastifyRequest, reply: FastifyReply) => {
                const body = toCamelCase(request.body);
                const matchId: number = body.matchId;
                const match = getMatchById(matchId);
                if (!match) throw new ApiError(ApiErrorCode.MATCH_NOT_FOUND, "Impossible de trouver un match avec cet ID");
                reply.send({
                    success: true, data: {
                        players: match.players.map(p => p.playerId),
                        scores: match.players.map(p => p.score),
                        is_paused: (match.isRunning && match.pausedAt !== -1)
                    }
                } as ISuccessResponse);
            }
        }
    );

    fastify.get("/matches", {
            handler: (_request: FastifyRequest, reply: FastifyReply) => {
                reply.send({success: true, data: MatchManager.getInstance().countMatches()} as ISuccessResponse);
            }
        }
    );

    fastify.get("/onlines", {
            handler: (_request: FastifyRequest, reply: FastifyReply) => {
                reply.send({success: true, data: WebsocketsManager.getInstance().countConnections()} as ISuccessResponse);
            }
        }
    );

    done();
}

function start(match: Match, players: Player[]) {
    const response = startMatch(match);
    if (response.success) {
        players.forEach((player: Player) => {
            const playerSocket = WebsocketsManager.getInstance().getSocketFromUserId(player.playerId);
            if (!playerSocket) return;
            playerSocket.send(JSON.stringify({
                channel: "game-started",
                data: {is_started: response.success}
            }))
        })
    }
    return response;
}