import {eventEmitter} from "../app"
import {FastifyInstance} from "fastify";

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
                        }

                    } catch (error) {
                        console.log("Error parsing message:", error);
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

    // WS Get PlayerInfo
    // WS Get BallInfo
    // Ws

    /* fastify.put(process.env.BASE_ROUTE + "/startGame/:MatchIndex", {
         handler: (request: FastifyRequest, reply: FastifyReply) => {
             startMatch(request, reply);
         }
     });


     fastify.put(process.env.BASE_ROUTE + "/generateNewPlayer", {
         schema: {body: genPlayer},
         handler: (request: FastifyRequest, reply: FastifyReply) => {
             playerJoinMatch(request, reply);
         }
     });*/

    done();
}