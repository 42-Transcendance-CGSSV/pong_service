import {eventEmitter} from "../app";
import {FastifyInstance} from "fastify";
import WebsocketsManager from "../managers/websockets.manager";
import {IBasicResponse} from "../interfaces/response.interface";
import {ApiError, ApiErrorCode} from "../utils/error.util";

export function registerSocketCoreListeners(app: FastifyInstance): void {

    eventEmitter.on("ws-opened", (_data: any, socket: WebSocket) => {
        WebsocketsManager.getInstance().addConnection(socket)
    });

    //TODO: IMPLEMENT IDENTIFY
    eventEmitter.on("ws-identify", (data: any, socket: WebSocket) => {
        if (data && typeof data === "object" && data["user_id"] && typeof data["user_id"] === "number") {
            if (!WebsocketsManager.getInstance().updateIdentity(socket, data["user_id"])) {
                {
                    app.log.error(`WebSocket identify error: Unable to update identity for user_id ${data["user_id"]}`);
                    throw new ApiError(ApiErrorCode.RESOURCE_NOT_FOUND , `WebSocket identify error: Unable to update identity for user_id ${data["user_id"]}`);
                    // socket.send(JSON.stringify({success: false, message: `WebSocket identify error: Unable to update identity for user_id ${data["user_id"]}`} as IBasicResponse));
                    // return;

                }
            }
            socket.send(JSON.stringify({success: true, message: `WebSocket identify success`} as IBasicResponse));
        }
        // socket.send(JSON.stringify({success: false, message: `WebSocket identify error: The user_id is missing`} as IBasicResponse))
        throw new ApiError(ApiErrorCode.INVALID_REQUEST_BODY, `WebSocket identify error: The user_id is missing`);
    });

    eventEmitter.on("ws-json-error", (data: any, _socket: WebSocket) => {
        if (data instanceof Error) {
            app.log.error(`WebSocket JSON error (unable to deserialize JSON): ${data.message}`);
            throw new ApiError(ApiErrorCode.INVALID_REQUEST_BODY, `WebSocket JSON error (unable to deserialize JSON): ${data.message}`);
        }
    });

    eventEmitter.on("ws-error", (data: any, _socket: WebSocket) => {
        if (data instanceof Error) {
            app.log.error(`WebSocket error : ${data.message}`);
            throw new ApiError(ApiErrorCode.WEBSOCKET_ERROR,`WebSocket error : ${data.message}`);
        }
    });

    eventEmitter.on("ws-closed", (_data: any, socket: WebSocket) => {
        WebsocketsManager.getInstance().removeConnection(socket)
    });

}