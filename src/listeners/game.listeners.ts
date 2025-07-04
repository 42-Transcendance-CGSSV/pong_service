import {app, eventEmitter} from "../app";
import {FastifyInstance} from "fastify";
import {
    getMatchById,
    getMatchData,
} from "../services/match.service";
import Match from "../classes/Match";

import {clearInterval} from "timers";
import type { WebSocket } from "ws";

export function registerGameListeners(_app: FastifyInstance): void {

    const matchIntervalManager: Map<number, NodeJS.Timeout> = new Map();
    eventEmitter.on("ws-message:get-match-data", (data: any, socket: WebSocket) => {
        let match: Match | null;

        if (data && typeof data === "object") {
            // app.log.info("                               get-match-data", data && typeof data["match_id"]);
            if (typeof data["match_id"] === "number") {
                if (!getMatchById(data["match_id"])) {
                    socket.send(JSON.stringify({success: false, message: "Missing match is null"}));
                    app.log.info(`Attempt to draw invalid match with id: ${data["match_id"]}`);
                    return;
                    // throw new ApiError(ApiErrorCode.MATCH_NOT_FOUND, "Match not found");
                }
                if (matchIntervalManager.has(data["match_id"])) {
                    clearInterval(matchIntervalManager.get(data["match_id"])!);
                    matchIntervalManager.delete(data["match_id"]);
                }
                const matchInterval: NodeJS.Timeout = setInterval(async () => {
                    matchIntervalManager.set(data["match_id"], matchInterval);
                    match = getMatchById(data["match_id"]);
                    if (match)
                        await matchLoopView(match.match_id, socket)
                    else {
                        clearInterval(matchIntervalManager.get(data["match_id"])!);
                        matchIntervalManager.delete(data["match_id"]);
                    }
                }, 17)

            } else {
                socket.send(JSON.stringify({success: false, message: "Missing match_id"}));
                // throw new ApiError(ApiErrorCode.INVALID_REQUEST_BODY, "Missing match_id");
            }
        } else {
            socket.send(JSON.stringify({success: false, message: "Invalid data format"}));
            // throw new ApiError(ApiErrorCode.INVALID_REQUEST_BODY, "Invalid data format");

        }
    })

    function matchLoopView(match_id: number, socket: WebSocket): Promise<void> {
        return new Promise((resolve, _reject) => {
            socket.send(JSON.stringify(getMatchData(match_id)))
            resolve();
        })
    }
}