import fastify from "fastify";
import dotenv from "dotenv";
import websockets from '@fastify/websocket'
import cors from "@fastify/cors";

import {EventEmitter} from "events"

import {pongController} from "./controllers/controller.game";
import {env} from "./utils/environment";
import {registerGameListeners} from "./listeners/game.listeners";
import {Engine} from "./pongEngine";
import {registerSocketCoreListeners} from "./listeners/core.listeners";
// import { matchmaking } from "./classes/Matchmaking";

const app = fastify({logger: false, ajv: {customOptions: {removeAdditional: "all"}}});
export const eventEmitter = new EventEmitter();

dotenv.config();

function start(): void {
    try {
        // matchmaking
        Engine.startGameLoop();

        app.register(websockets);
        app.register(pongController);

        registerSocketCoreListeners(app);
        registerGameListeners(app);
        app.register(cors, {
            origin: "*",
            methods: ["GET", "POST", "PUT", "DELETE"],
            allowedHeaders: ["Content-Type", "Authorization"],
        });
        app.listen({port: Number(env.PORT)});
    } catch (error) {
        app.log.error(error);
        process.exit(1);
    }
}

app.get(process.env.BASE_ROUTE + "/healthcheck", (_req, response) => {
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
