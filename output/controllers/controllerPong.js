"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pongController = pongController;
const sendItems_1 = require("../utils/sendItems");
const rate_limit_1 = __importDefault(require("@fastify/rate-limit"));
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
                        playersInfo: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    PlayerID: { type: "number" },
                                    PaddlePos: { type: "number" },
                                    side: { type: "string" },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    handler: sendItems_1.getAllPositions
};
const playerInfo = {
    schema: {
        response: {
            200: {
                type: "object",
                properties: {
                    PlayerID: { type: "number" },
                    PaddlePos: { type: "number" },
                    PaddleHeight: { type: "number" },
                    canvasHeight: { type: "number" },
                    moveSpeed: { type: "number" },
                    side: { type: "string" },
                    numberOfGoals: { type: "number" },
                    playerColor: { type: "string" },
                },
            }
        }
    },
    handler: sendItems_1.getPlayerInfo
};
function pongController(fastify, _options, done) {
    fastify.register(rate_limit_1.default, {
        max: 30,
        timeWindow: '1 second'
    });
    fastify.get(process.env.BASE_ROUTE + "/positions", pongPositions);
    fastify.get(process.env.BASE_ROUTE + "/player/:PlayerID", playerInfo);
    fastify.put(process.env.BASE_ROUTE + "/stopGame", sendItems_1.stopGame);
    fastify.put(process.env.BASE_ROUTE + "/startGame", sendItems_1.startGame);
    fastify.put(process.env.BASE_ROUTE + "/movePlayerUp/:PlayerID", sendItems_1.movePlayerUP);
    fastify.put(process.env.BASE_ROUTE + "/movePlayerDown/:PlayerID", sendItems_1.movePlayerDown);
    done();
}
