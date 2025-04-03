import { getAllPositions, getPlayerInfo, startGame, stopGame, movePlayerUP, movePlayerDown, generateNewPlayer } from "../utils/sendItems";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import rateLimit from "@fastify/rate-limit";
import { generatePlayerSchema } from "../schemas/put.schemas";
import PlayerInterface from "../interfaces/player.interface";

const pongPositions = {
    schema: {
        response: {
            200: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        ballID: { type: "number" },
                        ballX: { type: "number" },
                        ballY: { type: "number" },
                        ballVelocityX: { type: "number" },
                        ballVelocityY: { type: "number" },
                        playersInfo: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    PlayerID: { type: "number" },
                                    PlayerName: { type: "string" },
                                    PaddlePos: { type: "number" },
                                    PaddleHeight: { type: "number" },
                                    side: { type: "string" },
                                    playerColor: { type: "string" },
                                    AI: { type: "boolean" }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    handler: getAllPositions
};

const playerInfo = {
    schema: {
        response: {
            200: {
                type: "object",
                properties: {
                    PlayerId: { type: "number" },
                    PlayerName: { type: "string" },
                    PaddlePos: { type: "number" },
                    PaddleHeight: { type: "number" },
                    canvasHeight: { type: "number" },
                    moveSpeed: { type: "number" },
                    side: { type: "string" },
                    numberOfGoals: { type: "number" },
                    playerColor: { type: "string" },
                    AI: { type: "boolean" }
                }
            }
        }
    },
    handler: getPlayerInfo
};


export function pongController(fastify: FastifyInstance, _options: any, done: () => void): void {
    fastify.register(rateLimit, {
        max: 30,
        timeWindow: "1 second"
    });

    fastify.get(process.env.BASE_ROUTE + "/positions", pongPositions);

    fastify.get(process.env.BASE_ROUTE + "/player/:PlayerID", playerInfo);

    fastify.put(process.env.BASE_ROUTE + "/stopGame", stopGame);
    fastify.put(process.env.BASE_ROUTE + "/startGame", startGame);
    fastify.put(process.env.BASE_ROUTE + "/movePlayerUp/:PlayerID", movePlayerUP);
    fastify.put(process.env.BASE_ROUTE + "/movePlayerDown/:PlayerID", movePlayerDown);

    fastify.put(process.env.BASE_ROUTE + "/generateNewPlayer", {
        schema: { body: generatePlayerSchema },
        handler: (request: FastifyRequest, reply: FastifyReply) => {
            generateNewPlayer(request, reply);
        }
    });
    done();
}
