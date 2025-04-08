"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pongController = pongController;
const sendItems_1 = require("../utils/sendItems");
const rate_limit_1 = __importDefault(require("@fastify/rate-limit"));
const player_schema_1 = __importDefault(require("../schemas/player.schema"));
// import MatchInfo from "../schemas/Match.schema";
const gen_player_schema_1 = __importDefault(require("../schemas/gen.player.schema"));
function pongController(fastify, _options, done) {
    fastify.register(rate_limit_1.default, {
        max: 30,
        timeWindow: '1 second'
    });
    fastify.get(process.env.BASE_ROUTE + "/player/:PlayerID", {
        // schema:{params: playerInfo},
        handler: (request, reply) => {
            (0, sendItems_1.getPlayerInfo)(request, reply);
        }
    });
    fastify.get(process.env.BASE_ROUTE + "/match/:MatchID", {
        // schema:{params: MatchInfo},
        handler: (request, reply) => {
            (0, sendItems_1.getMatchInfo)(request, reply);
        }
    });
    fastify.put(process.env.BASE_ROUTE + "/stopGame/:MatchIndex", {
        handler: (request, reply) => {
            (0, sendItems_1.stopGame)(request, reply);
        }
    });
    fastify.put(process.env.BASE_ROUTE + "/startGame/:MatchIndex", {
        handler: (request, reply) => {
            (0, sendItems_1.startGame)(request, reply);
        }
    });
    fastify.post(process.env.BASE_ROUTE + "/movePlayerUp/:PlayerID", {
        schema: { body: player_schema_1.default },
        handler: (request, reply) => {
            (0, sendItems_1.movePlayerUP)(request, reply);
        }
    });
    fastify.post(process.env.BASE_ROUTE + "/movePlayerDown/:PlayerID", {
        schema: { body: player_schema_1.default },
        handler: (request, reply) => {
            (0, sendItems_1.movePlayerDown)(request, reply);
        }
    });
    fastify.put(process.env.BASE_ROUTE + "/generateNewPlayer", {
        schema: { body: gen_player_schema_1.default },
        handler: (request, reply) => {
            (0, sendItems_1.generateNewPlayer)(request, reply);
        }
    });
    done();
}
