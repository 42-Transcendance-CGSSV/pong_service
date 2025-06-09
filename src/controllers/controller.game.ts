import {eventEmitter} from "../app"
import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";

import WsEvent from "../classes/WsEvent";
import MatchManager from "../managers/match.manager";
import {IBasicResponse} from "../interfaces/response.interface";
import initPlayerSchemas from "../schemas/gen.player.schema";
import schemas from "fluent-json-schema";
import {startMatch} from "../services/match.service";

export function pongController(fastify: FastifyInstance, _options: any, done: () => void) {

    fastify.register(async function (fastify) {
        fastify.get('/pong-ws', {websocket: true},
            (connection, _req) => {
                const socket = connection;

                eventEmitter.emit("ws-opened", socket);

                socket.on('message', (message: Buffer) => {
                    try {
                        const data: unknown = JSON.parse(message.toString());

                        if (data && typeof data === 'object' && 'channel' in data) {
                            const receivedData: unknown | undefined = 'data' in data ? data.data : undefined;
                            if (data.channel === "identify" && receivedData && typeof receivedData === "object" && "user_id" in receivedData) {
                                eventEmitter.emit("ws-identify", receivedData, socket);
                                return;
                            }
                            eventEmitter.emit("ws-message", new WsEvent(data.channel as string, receivedData), socket);
                            eventEmitter.emit("ws-message:" + data.channel, receivedData, socket);

                        }

                    } catch (error) {
                        eventEmitter.emit("ws-json-error", error, socket);
                    }
                });

                socket.on('close', () => {
                    eventEmitter.emit("ws-closed", socket);
                });

                socket.on('error', (error: Error) => {
                    eventEmitter.emit("ws-error", error, socket);
                });
            });
    });

    fastify.put(process.env.BASE_ROUTE + "/match/create", { // TODO: adapt
        schema: {
            body: schemas.object().prop("scoreGoal", schemas.number().minimum(1).required())
                                  .prop("match_id", schemas.number().minimum(1).required())
        },
        handler: async (request: FastifyRequest, reply: FastifyReply) => {
            const body = request.body as { scoreGoal: number; match_id: number };
            const match = MatchManager.getInstance().createMatch(body.scoreGoal, body.match_id);
            reply.send({success: true, message: "The match has been created", data: match} as IBasicResponse);
        }
    });
    fastify.get(process.env.BASE_ROUTE + "/players", {
            handler: (_request: FastifyRequest, reply: FastifyReply) => {
                // return all players in all matches
                const players = MatchManager.getInstance().players;
                reply.send({success: true, message: "Players ", data: players} as IBasicResponse);
            }
        }
    );
    fastify.get(process.env.BASE_ROUTE + "/matches", {
            handler: (_request: FastifyRequest, reply: FastifyReply) => {
                // return all matches
                const matches = MatchManager.getInstance().matches;
                reply.send({success: true, message: "Matches ", data: matches} as IBasicResponse);
            }
        }
    );

    interface IInitPlayers {
        
        player_name: string;
        user_id: number;
        is_ai: boolean;
        isTraining: boolean;
        
    }

    fastify.put(process.env.BASE_ROUTE + "/match/init-player", {
        schema: {body: initPlayerSchemas},
        handler: async (request: FastifyRequest, reply: FastifyReply) => {
            const p = request.body as IInitPlayers;
            if (MatchManager.getInstance().playerExists(p.user_id)) throw new Error(`${p.user_id} already exists`);

            // MatchManager.getInstance().
            MatchManager.getInstance().createPlayer(p.player_name, p.user_id, p.is_ai, p.isTraining);
            reply.send({
                success: true,
                message: "player initialized",
                data: MatchManager.getInstance().players
            } as IBasicResponse);
        }
    });

    fastify.put(process.env.BASE_ROUTE + "/placeSeated", {
        schema: {body: schemas.object().prop("user_id", schemas.number().minimum(0).required()).prop("match_id", schemas.number().minimum(0).required())},
        handler: async (request: FastifyRequest, reply: FastifyReply) => {
            const p = request.body as {user_id: number, match_id: number};
            if (!MatchManager.getInstance().playerExists(p.user_id)) throw new Error(`Player ${p.user_id} does not exist`);
            if (!MatchManager.getInstance().getMatchById(p.match_id)) throw new Error(`Match ${p.match_id} does not exist`);

            // MatchManager.getInstance().
            MatchManager.getInstance().seatPlayer(p.user_id, p.match_id);
            reply.send({
                success: true,
                message: "player initialized",
                data: MatchManager.getInstance().players
            } as IBasicResponse);
        }
    });

    fastify.put(process.env.BASE_ROUTE + "/match/ready/:user_id", {
        schema: {querystring: schemas.object().prop("user_id", schemas.number().minimum(0).required())},
        handler: (request: FastifyRequest, reply: FastifyReply) => {
            if (!(request.params && typeof request.params === "object" && "user_id" in request.params))
                throw new Error("Invalid request");
            const userId = request.params.user_id as number;
            const match = MatchManager.getInstance().getMatchByPlayer_id(userId);
            if (!match) throw new Error("Match not found for this user");
            const player = match.getPlayerById(userId);
            if (!player) throw new Error("Player not found in this match");
            player.ready = true;
            reply.send({success: true, message: "Player is ready", data: player} as IBasicResponse);
        }
    });

    fastify.put(process.env.BASE_ROUTE + "/match/start/:match_id", {
            schema: {querystring: schemas.object().prop("match_id", schemas.number().minimum(0).required())},
            handler: (request: FastifyRequest, reply: FastifyReply) => {
                if (!(request.params && typeof request.params === "object" && "match_id" in request.params))
                    throw new Error("Invalid request");
                const match_id = request.params.match_id as number;
                const match = MatchManager.getInstance().getMatchById(match_id);
                if (!match) throw new Error("Match not found for this user");
                const isReady = match.getPlayersInMatch().every(p => p.ready);
                if (isReady) {
                    startMatch(match);
                }
                reply.send({success: true, message: "Match started", data: match} as IBasicResponse);
            }
        }
    );

    


    done();
}