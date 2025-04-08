"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const static_1 = __importDefault(require("@fastify/static"));
const path_1 = __importDefault(require("path"));
const fastify_1 = __importDefault(require("fastify"));
const dotenv_1 = __importDefault(require("dotenv"));
// import items from "./items";
const controllerPong_1 = require("./controllers/controllerPong");
const swagger_ui_1 = __importDefault(require("@fastify/swagger-ui"));
const swagger_1 = __importDefault(require("@fastify/swagger"));
const app = (0, fastify_1.default)({ logger: false, ajv: { customOptions: { removeAdditional: "all" } } });
app.register(controllerPong_1.pongController);
app.register(swagger_1.default, {
    swagger: {
        info: {
            title: "Pong API",
            description: "API Documentation for Pong",
            version: "0.1.0",
        },
    }
});
app.register(swagger_ui_1.default, {
    routePrefix: "/doc",
    uiConfig: {
        docExpansion: 'full',
        deepLinking: false,
    }
});
app.register(static_1.default, {
    root: path_1.default.join(__dirname, '../public'),
    prefix: '/', // so it serves at http://localhost:3000/
});
dotenv_1.default.config();
//TODO: FIXING ENV UNDEFINED
async function start() {
    try {
        await app.listen({ port: Number(process.env.PORT) });
        // await app.listen();
    }
    catch (error) {
        app.log.error(error);
        process.exit(1);
    }
}
app.get(process.env.BASE_ROUTE + "/healthcheck", (_req, response) => {
    response.send({ message: "Success" });
});
start();
