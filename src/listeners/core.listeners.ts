import {eventEmitter} from "../app";
import {FastifyInstance} from "fastify";
import WebsocketsManager from "../managers/websockets.manager";

export function registerSocketCoreListeners(app: FastifyInstance): void {

    eventEmitter.on("ws-opened", (_data: any, socket: WebSocket) => {
        WebsocketsManager.getInstance().addConnection(socket)
    });

    //TODO: IMPLEMENT IDENTIFY
    eventEmitter.on("ws-identify", (_data: any, _socket: WebSocket) => {
    });

    eventEmitter.on("ws-json-error", (data: any, _socket: WebSocket) => {
        if (data instanceof Error) {
            app.log.error(`WebSocket JSON error (unable to deserialize JSON): ${data.message}`);
            //TODO: Send error message to client
        }
    });

    eventEmitter.on("ws-error", (data: any, _socket: WebSocket) => {
        if (data instanceof Error) {
            app.log.error(`WebSocket error : ${data.message}`);
            //TODO: Send error message to client
        }
    });

    eventEmitter.on("ws-closed", (_data: any, socket: WebSocket) => {
        WebsocketsManager.getInstance().removeConnection(socket)
    });

}