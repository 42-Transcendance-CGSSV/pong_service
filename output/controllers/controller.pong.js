"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const items_1 = __importDefault(require("../items"));
function pongController(fastify, _options, done) {
    fastify.get(process.env.BASE_ROUTE + "/positions", (_request, reply) => {
        reply.send(items_1.default);
    });
    fastify.get(process.env.BASE_ROUTE + "/player/:id", (request, reply) => {
        const { id } = request.params;
        const item = items_1.default.find((item) => item.id === id);
        if (item) {
            reply.send(item);
        }
        else {
            reply.status(404).send({ message: "Item not found" });
        }
    });
    done();
}
exports.default = pongController;
