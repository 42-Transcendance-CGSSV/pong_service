import fastify from "fastify";
import websockets from '@fastify/websocket'

import {EventEmitter} from "events"
import {env} from "./utils/environment";

import {pongController} from "./controllers/controller.game";
import {registerGameListeners} from "./listeners/game.listeners";
import pongEngine from "./pongEngine";
import {registerSocketCoreListeners} from "./listeners/core.listeners";
import {ApiError} from "./utils/error.util";
import {IBasicResponse} from "./interfaces/response.interface";
import {Matchmaking} from "./classes/Matchmaking";
// import { matchmaking } from "./classes/Matchmaking";

export const app = fastify({
    logger: {
        transport: {
            target: "pino-pretty",
            options: {
                colorize: true
            }
        },
        enabled: true,
        level: env.LOG_LEVEL,
        timestamp: () => {
            const now = new Date();
            const day = String(now.getDate()).padStart(2, "0");
            const month = String(now.getMonth() + 1).padStart(2, "0");
            const year = String(now.getFullYear()).slice(-2);
            const hours = String(now.getHours()).padStart(2, "0");
            const minutes = String(now.getMinutes()).padStart(2, "0");
            const seconds = String(now.getSeconds()).padStart(2, "0");
            const milliseconds = String(now.getMilliseconds());
            const logTime = env.LOG_TIME_FORMAT.replace("${day}", day)
                .replace("${month}", month)
                .replace("${year}", year)
                .replace("${hours}", hours)
                .replace("${minutes}", minutes)
                .replace("${seconds}", seconds)
                .replace("${milliseconds}", milliseconds);
            return `,"time":"${logTime}"`;
        }
    },
    disableRequestLogging: true
});
export const eventEmitter = new EventEmitter();

function start(): void {
    try {
        // matchmaking
        // Engine.startGameLoop();
        app.register(websockets);

        pongEngine.getInstance().startGameLoop();
        Matchmaking.getInstance();

        app.register(pongController);

        registerSocketCoreListeners(app);
        registerGameListeners(app);

        app.setErrorHandler((error, _request, reply) => {
            if (error.name === "ApiError") {
                reply.code((error as ApiError).getHttpStatusCode()).send({
                    success: false,
                    errorCode: error.code,
                    message: error.message
                } as IBasicResponse);
                return;
            }

            const statusCode = error.statusCode || 500;
            reply.status(statusCode).send({
                success: false,
                message: error.message,
                errorCode: error.code || "INTERNAL_SERVER_ERROR"
            } as IBasicResponse);
        });

        app.listen({port: 3001, host: "0.0.0.0"});
    } catch (error) {
        app.log.error(error);
        process.exit(1);
    }
}

app.get("/healthcheck", (_req, response) => {
    response.send({message: "Success"});
});

start();


/*eventEmitter.on("ws-message", (data: any, socket: WebSocket) => {
    if (data instanceof Error) {
        app.log.error(`WebSocket error: ${data.message}`);
        socket.send(JSON.stringify({error: data.message}));
    } else {
        if (data && typeof data === "object" && data instanceof WsEvent) {
            app.log.info(`WebSocket message received on channel: ${data.getChannel()}`);
            if (data.getData()) {
                console.log("data", data.getDataAsObject()["user-id"]);
            }
        }
        socket.send(JSON.stringify({message: "Message received", data}));
    }
});*/
