import {
    getMatchInfo,
    getPlayerInfo,
    playGame,
    pauseGame,
    generateNewPlayer,
} from "../utils/sendItems";

import {eventEmitter} from "../app"
import {FastifyInstance, FastifyRequest, FastifyReply} from "fastify";

import genPlayer from "../schemas/gen.player.schema";
import WsEvent from "../classes/WsEvent";

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
                            eventEmitter.emit("ws-message", new WsEvent(data.channel as string, receivedData), socket);
                            eventEmitter.emit("ws-message:" + data.channel, receivedData, socket);
                            console.log("ws-message:" + data.channel)
                        }

                    } catch (error) {
                        eventEmitter.emit("ws-message", error, socket);
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

    fastify.get(process.env.BASE_ROUTE + "/player/:PlayerID", {
        // schema:{params: playerInfo},
        handler: (request: FastifyRequest, reply: FastifyReply) => {
            getPlayerInfo(request, reply);
        }

    });

    // WS Get PlayerInfo
    // WS Get BallInfo
    // Ws

    fastify.get(process.env.BASE_ROUTE + "/match/:MatchID", {
        // schema:{params: MatchInfo},
        handler: (request: FastifyRequest, reply: FastifyReply) => {
            getMatchInfo(request, reply);
        }
    })


    fastify.put(process.env.BASE_ROUTE + "/stopGame/:MatchIndex", {
        handler: (request: FastifyRequest, reply: FastifyReply) => {
            pauseGame(request, reply);
        }
    });
    fastify.put(process.env.BASE_ROUTE + "/startGame/:MatchIndex", {
        handler: (request: FastifyRequest, reply: FastifyReply) => {
            playGame(request, reply);
        }
    });


    fastify.put(process.env.BASE_ROUTE + "/generateNewPlayer", {
        schema: {body: genPlayer},
        handler: (request: FastifyRequest, reply: FastifyReply) => {
            generateNewPlayer(request, reply);
        }
    });

    done();
}