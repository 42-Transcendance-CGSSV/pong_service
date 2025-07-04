import schema from "fluent-json-schema";
import { FastifyInstance } from "fastify";
import { eventEmitter } from "../app";
import Ajv, { Schema } from "ajv";
import type { WebSocket } from "ws";
import { IErrorResponse } from "../interfaces/response.interface";
import WebsocketsManager from "../managers/websockets.manager";

type WsHandler = (data: any, socket: WebSocket) => void;

interface WsChannelEntry {
    schema: Schema;
    handler: WsHandler;
}

const wsChannel: Record<string, WsChannelEntry> = {};
const minimumSchema = schema.object().prop("channel", schema.string().required()).prop("data", schema.object().required()).valueOf();

export const webSockets = {
    register(channel: string, entry: WsChannelEntry): void {
        wsChannel[channel] = entry;
    },
    getRegistry(): Record<string, WsChannelEntry> {
        return wsChannel;
    }
};

export async function websocketRegistry(fastify: FastifyInstance): Promise<void> {
    fastify.register(async function (fastify) {
        fastify.get("/pong-ws", { websocket: true }, (connection, req) => {
            const socket: WebSocket = connection;

            WebsocketsManager.getInstance().addConnection(socket, req.publicUser!.id);

            eventEmitter.emit("ws-opened", socket);
            const ajv = new Ajv();
            const validate = ajv.compile(minimumSchema);

            socket.on("message", (message: Buffer) => {
                try {
                    const data: unknown = JSON.parse(message.toString());
                    if (!validate(data)) {
                        socket.send(
                            JSON.stringify({
                                success: false,
                                message: "Invalid message format (channel, data)"
                            } as IErrorResponse)
                        );
                        return;
                    }

                    const { channel, data: receivedData } = data as { channel: string; data: any };

                    if (!WebsocketsManager.getInstance().getUserIdFromSocket(socket)) {
                        socket.send(
                            JSON.stringify({
                                success: false,
                                message: "You need authenticate before send websocket"
                            } as IErrorResponse)
                        );
                        return;
                    }

                    const entry: WsChannelEntry = webSockets.getRegistry()[channel];

                    if (!entry) {
                        fastify.log.error("Unable to find this channel for the websocket !");
                        socket.send(JSON.stringify({ success: false, message: "Unknown channel" } as IErrorResponse));
                        eventEmitter.emit("ws-channel-error", socket, channel);
                        return;
                    }

                    const channelValidate = ajv.compile(entry.schema);
                    if (!channelValidate(receivedData)) {
                        socket.send(
                            JSON.stringify({
                                success: false,
                                message: "Invalid data for channel"
                            } as IErrorResponse)
                        );
                        eventEmitter.emit("ws-schema-error", socket, channelValidate.errors);
                        return;
                    }

                    entry.handler(receivedData, socket);
                } catch (error) {
                    eventEmitter.emit("ws-json-error", error, socket, message.toString);
                }
            });

            socket.on("close", () => WebsocketsManager.getInstance().removeConnection(socket));
            socket.on("error", (error: Error) => eventEmitter.emit("ws-error", error, socket));
        });
    });
}