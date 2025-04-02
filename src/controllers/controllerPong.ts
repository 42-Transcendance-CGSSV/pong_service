import { getAllPositions , getPlayerInfo , startGame ,stopGame ,movePlayerUP, movePlayerDown, generateNewPlayer} from "../utils/sendItems";
import { FastifyInstance } from "fastify";
import rateLimit from '@fastify/rate-limit';

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
                                    PlayerID        :  { type: "number" },
                                    PlayerName      :  { type: "string" },
                                    PaddlePos       :  { type: "number" },
                                    PaddleHeight    :  { type: "number" },
                                    side            :  { type: "string" },
                                    playerColor     :  { type: "string" },
                                    AI              :  { type: "boolean" },
                                    
                                },
                            },
                        },
                    },
                },
            },
        },      
    },
    handler: getAllPositions
};

const playerInfo = {
    schema: {
        
        response: {
            200: {
                type: "object",
                properties: {
                    PlayerID        :  { type: "number" },
                    PlayerName      :  { type: "string" },
                    PaddlePos       :  { type: "number" },
                    PaddleHeight    :  { type: "number" },
                    canvasHeight    :  { type: "number" },
                    moveSpeed       :  { type: "number" },
                    side            :  { type: "string" },
                    numberOfGoals   :  { type: "number" },
                    playerColor     :  { type: "string" },
                    AI              :  { type: "boolean" },
                },
            }
        }
    },
    handler: getPlayerInfo
};

const genPlayer = {
    schema: {
        body: {
            type: "object",
            properties: {
                playerID        : { type: "number" },
                PlayerName      : { type: "string" },
                PaddleHeight    : { type: "number" },
                PaddleWidth     : { type: "number" },
                canvasHeight    : { type: "number" },
                moveSpeed       : { type: "number" },
                side            : { type: "string" },
                AI              : { type: "boolean" },
            },
            required: ["playerID", "PaddleHeight", "PaddleWidth", "canvasHeight", "moveSpeed", "side"],
    }
    },
    handler: generateNewPlayer
}










export function pongController(fastify: FastifyInstance, _options: any, done: () => void)
{

    fastify.register(rateLimit, {
        max: 30,
        timeWindow: '1 second'
    });

    fastify.get(process.env.BASE_ROUTE + "/positions", pongPositions);
    
    fastify.get(process.env.BASE_ROUTE + "/player/:PlayerID", playerInfo);

    fastify.put(process.env.BASE_ROUTE + "/stopGame", stopGame);
    fastify.put(process.env.BASE_ROUTE + "/startGame", startGame);
    fastify.put(process.env.BASE_ROUTE + "/movePlayerUp/:PlayerID", movePlayerUP);
    fastify.put(process.env.BASE_ROUTE + "/movePlayerDown/:PlayerID", movePlayerDown);

    fastify.put(process.env.BASE_ROUTE + "/generateNewPlayer", genPlayer);
    
    done();
}