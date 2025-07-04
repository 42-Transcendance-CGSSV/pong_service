import {app} from "../app"
import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";

import MatchManager from "../managers/match.manager";
import initPlayerSchemas from "../schemas/gen.player.schema";
import schemas from "fluent-json-schema";
import {startMatch} from "../services/match.service";
import ApiError, {ApiErrorCode} from "../utils/error.util";
import {ISuccessResponse} from "../interfaces/response.interface";


export function pongController(fastify: FastifyInstance, _options: any, done: () => void) {

    fastify.put("/match/create", { // TODO: can be removed
        schema: {
            body: schemas.object().prop("scoreGoal", schemas.number().minimum(1).required())
        },
        handler: async (request: FastifyRequest, reply: FastifyReply) => {
            const body = request.body as { scoreGoal: number; match_id: number };
            const match = MatchManager.getInstance().createMatch(body.scoreGoal);
            reply.send({success: true, message: "The match has been created", data: match} as ISuccessResponse);
        }
    });
    fastify.get("/players", { // TODO: Can be removed
            handler: (_request: FastifyRequest, reply: FastifyReply) => {
                // return all players in all matches
                const players = MatchManager.getInstance().players;
                reply.send({success: true, message: "Players ", data: players} as ISuccessResponse);
            }
        }
    );

    fastify.get("/player/:user_id", {
            schema: {params: schemas.object().prop("user_id", schemas.number().minimum(0).required())},
            handler: (request: FastifyRequest, reply: FastifyReply) => {
                if (!(request.params && typeof request.params === "object" && "user_id" in request.params))
                    throw new Error("Invalid request");
                const userId = request.params.user_id as number;
                // console.log ("for user_id", userId);
                app.log.debug(`Fetching player with user_id: ${userId}`);
                const players = MatchManager.getInstance().players;
                if (players.length === 0) {
                    throw new ApiError(ApiErrorCode.RESOURCE_NOT_FOUND, "players not found")
                }
                const player = players.find(p => p.playerId === userId);
                if (!player) {
                    throw new ApiError(ApiErrorCode.USER_NOT_FOUND, `Player with user_id ${userId} not found`);
                }
                reply.send({success: true, message: "Player found", data: player} as ISuccessResponse);
            }
        }
    );




    fastify.get("/matchByPlayerId/:user_id", {
            schema: {params: schemas.object().prop("user_id", schemas.number().minimum(0).required())},
            handler: (request: FastifyRequest, reply: FastifyReply) => {
                if (!(request.params && typeof request.params === "object" && "user_id" in request.params))
                    throw new ApiError(ApiErrorCode.RESOURCE_NOT_FOUND, "players not found")
                const userId = request.params.user_id as number;
                app.log.debug(`Fetching matches with user_id: ${userId}`);
                const players = MatchManager.getInstance().players;
                if (players.length === 0) {
                    throw new ApiError(ApiErrorCode.RESOURCE_NOT_FOUND, "players not found")
                }
                const player = players.find(p => p.playerId === userId);
                if (!player) {
                    throw new ApiError(ApiErrorCode.USER_NOT_FOUND, `Player with user_id ${userId} not found`);
                }
                const match = MatchManager.getInstance().getMatchByPlayerId(userId);
                if (!match) {
                    throw new ApiError(ApiErrorCode.MATCH_NOT_FOUND, `Match for player with user_id ${userId} not found`);
                }
                app.log.debug(`//////////////////////////////////////////////////////Match found for user_id ${userId}: ${match.match_id}`);
                reply.send({success: true, message: "Player found", data: match.match_id} as ISuccessResponse);
            }
        }
    );

    fastify.get("/matches", {
            handler: (_request: FastifyRequest, reply: FastifyReply) => {
                // return all matches
                const matches = MatchManager.getInstance().matches;
                if (matches.length === 0) {
                    // reply.send({success: false, message: "No matches found"} as IBasicResponse);
                    throw new ApiError(ApiErrorCode.RESOURCE_NOT_FOUND, "match not found")
                }
                reply.send({success: true, message: "Matches ", data: matches} as ISuccessResponse);
            }
        }
    );

    interface IInitPlayers {

        player_name: string;
        user_id: number;
        is_ai: boolean;
        isTraining: boolean;

    }

    fastify.put("/match/init-player", {
        schema: {body: initPlayerSchemas},
        handler: async (request: FastifyRequest, reply: FastifyReply) => {
            const p = request.body as IInitPlayers;
            if (MatchManager.getInstance().playerExists(p.user_id)) throw new ApiError(ApiErrorCode.RESOURCE_ALREADY_EXISTS, `${p.user_id} already exists`)

            // MatchManager.getInstance().
            MatchManager.getInstance().createPlayer(p.player_name, p.user_id, p.is_ai, p.isTraining);
            reply.send({
                success: true,
                message: "player initialized",
                data: MatchManager.getInstance().players
            } as ISuccessResponse);
        }
    });

    fastify.put("/placeSeated", { // TODO: can be removed
        schema: {body: schemas.object().prop("user_id", schemas.number().minimum(0).required()).prop("match_id", schemas.number().minimum(0).required())},
        handler: async (request: FastifyRequest, reply: FastifyReply) => {
            const p = request.body as { user_id: number, match_id: number };
            if (!MatchManager.getInstance().playerExists(p.user_id)) throw new ApiError(ApiErrorCode.USER_NOT_FOUND, `Player ${p.user_id} does not exist`)
            if (!MatchManager.getInstance().getMatchById(p.match_id)) throw new ApiError(ApiErrorCode.RESOURCE_NOT_FOUND, `Match ${p.match_id} does not exist`)

            // MatchManager.getInstance().
            MatchManager.getInstance().seatPlayer(p.user_id, p.match_id);
            reply.send({
                success: true,
                message: "player initialized",
                data: MatchManager.getInstance().players
            } as ISuccessResponse);
        }
    });


    //TODO: refactor to avoid id spoofing
    fastify.put("/kick", {
        schema: {body: schemas.object().prop("user_id", schemas.number().minimum(0).required())},
        handler: async (request: FastifyRequest, reply: FastifyReply) => {
            const p = request.body as { user_id: number };
            if (!MatchManager.getInstance().playerExists(p.user_id)) throw new ApiError(ApiErrorCode.USER_NOT_FOUND, `Player ${p.user_id} does not exist`)
            MatchManager.getInstance().purgePlayer(p.user_id);
            reply.send({
                success: true,
                message: "player purged",
            } as ISuccessResponse);
        }
    });


    fastify.put("/match/ready/:user_id", {
        schema: {querystring: schemas.object().prop("user_id", schemas.number().minimum(0).required())},
        handler: (request: FastifyRequest, reply: FastifyReply) => {
            if (!(request.params && typeof request.params === "object" && "user_id" in request.params))
                throw new Error("Invalid request");
            const userId = request.params.user_id as number;
            const match = MatchManager.getInstance().getMatchByPlayerId(userId);
            if (!match) throw new Error("Match not found for this user");
            const player = match.getPlayerById(userId);
            if (!player) throw new Error("Player not found in this match");
            player.ready = true;
            reply.send({success: true, message: "Player is ready", data: player} as ISuccessResponse);
        }
    });

    fastify.put("/match/start/:match_id", {
            schema: {querystring: schemas.object().prop("match_id", schemas.number().minimum(0).required())},
            handler: (request: FastifyRequest, reply: FastifyReply) => {
                if (!(request.params && typeof request.params === "object" && "match_id" in request.params))
                    throw new Error("Invalid request");
                const match_id = request.params.match_id as number;
                const match = MatchManager.getInstance().getMatchById(match_id);
                if (!match) throw new ApiError(ApiErrorCode.MATCH_NOT_FOUND, "Match not found for this user");
                // throw new Error("Match not found for this user");
                const isReady = match.getPlayersInMatch().every(p => p.ready);
                if (isReady) {
                    startMatch(match);
                }
                reply.send({success: true, message: "Match started", data: match} as ISuccessResponse);
            }
        }
    );


    done();
}