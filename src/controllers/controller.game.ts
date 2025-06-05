import {eventEmitter} from "../app"
import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";

import WsEvent from "../classes/WsEvent";
import MatchManager from "../managers/match.manager";
import {IBasicResponse} from "../interfaces/response.interface";
import initPlayersSchemas from "../schemas/gen.player.schema";
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

    fastify.put(process.env.BASE_ROUTE + "/match/create", {
        handler: async (_request: FastifyRequest, reply: FastifyReply) => {
            const match = MatchManager.getInstance().createMatch(50000);
            reply.send({success: true, message: "The match has been created", data: match} as IBasicResponse);
        }
    });

    interface IInitPlayers {
        match_id: number;
        player_1: {
            player_name: string;
            user_id: number;
            is_ai: boolean;
        },
        player_2: {
            player_name: string;
            user_id: number;
            is_ai: boolean;
        }
    }

    fastify.put(process.env.BASE_ROUTE + "/match/init-players", {
        schema: {body: initPlayersSchemas},
        handler: async (request: FastifyRequest, reply: FastifyReply) => {
            if (!request.body)
                return reply.status(400).send({success: false, message: "No match_id provided"} as IBasicResponse); //TODO replace with APiError
            const body = request.body as IInitPlayers;
            if (MatchManager.getInstance().getMatchByPlayer_id(body.player_1.user_id )) throw new Error("Player1 already in a match");
            if (MatchManager.getInstance().getMatchByPlayer_id(body.player_2.user_id)) throw new Error("Player2 already in a match");


            const match = MatchManager.getInstance().getMatchById(body.match_id);
            if (!match) {
                throw Error("Match not found here"); //TODO: replace with APiError
            }
            match.addPlayer(body.player_1.player_name, body.player_1.user_id, body.player_1.is_ai)
            match.addPlayer(body.player_2.player_name, body.player_2.user_id, body.player_2.is_ai);
            reply.send({
                success: true,
                message: "The match has been created",
                data: match
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