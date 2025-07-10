import MatchManager from "../managers/match.manager";
import Match, {AiNeeds} from "../classes/Match";
import Player from "../classes/Player";
import {ScoreRegistryInterface} from "../interfaces/score.registry.interface";
import {app, eventEmitter} from "../app";
import {IErrorResponse, ISuccessResponse} from "../interfaces/response.interface";
import WebsocketsManager from "../managers/websockets.manager";
import type {WebSocket} from "ws";

export function getMatchData(match_id: number): ISuccessResponse | IErrorResponse {
    const match = MatchManager.getInstance().getMatchById(match_id);
    if (!match) return {success: false, message: "match does not exist !", errorCode: "404"} as IErrorResponse;

    return {
        success: true,
        message: "Match found",
        data: match.exportRenderInfo(),
        errorCode: "200"
    } as ISuccessResponse;
}

export function getAiNeeds(socket: WebSocket): AiNeeds | null {
    const userId = WebsocketsManager.getInstance().getUserIdFromSocket(socket);
    if (!userId) return null;

    const match: Match | null  = MatchManager.getInstance().getMatchByPlayerId(userId);
    if (!match) return null;

    const needs = match.exportAiNeeds();
    if (!needs) return null
    return needs;
}

export function gettainingData(): ScoreRegistryInterface[] | null {
    const match: Match[] = Array.from(MatchManager.getInstance().matches.values())
    const payload: ScoreRegistryInterface[] = [];
    if (!match) return null
    match.forEach((m) => {
        const needs = m.exportRegistry();
        if (needs) {
            needs.forEach((n) => {
                if (n)
                    payload.push(n)
            })

        }
    })
    if (payload.length === 0) return null
    return payload;
}

export function getMatchById(match_id: number): Match | null {
    const match = MatchManager.getInstance().getMatchById(match_id);
    if (!match) return null
    return match
}


export function getPlayerData(Player_id: number): ISuccessResponse | IErrorResponse {

    const match = MatchManager.getInstance().getMatchByPlayerId(Player_id);
    if (!match) return {success: false, message: "match does not exist !", errorCode: "404"} as IErrorResponse;

    const player = match.getPlayerById(Player_id);
    if (!player) return {success: false, message: "Unable to find the player !", errorCode: "404"} as IErrorResponse;
    return {success: true, message: "Player found", data: player.ExportPlayerInfo()} as ISuccessResponse;
}


export function togglePauseMatch(match_id: number): ISuccessResponse | IErrorResponse {
    const match = MatchManager.getInstance().getMatchById(match_id);
    if (!match) return {success: false, message: "match does not exist !", errorCode: "404"} as IErrorResponse;

    match.pausedAt = match.pausedAt === -1 ? Date.now() : -1;
    match.isRunning = !match.isRunning;

    const message = match.isRunning ? `Game ${match_id} resumed` : `Game ${match_id} paused`;

    app.log.debug(message)
    return {success: true, message: message} as ISuccessResponse;
}

export function startMatch(match: Match): ISuccessResponse | IErrorResponse {

    if (match.getOnlinePlayerInMatch().length !== 2) return {
        success: false,
        message: "Not enough players",
        errorCode: "404"
    } as IErrorResponse;

    match.startedAt = Date.now();
    match.isRunning = true;

    const message = "Game " + match.matchId + " started";

    app.log.info(message)
    return {success: true, message: message} as ISuccessResponse;
}

/**
 * End match
 * @param match the instance of match
 * @param winnerId the winner id, -1 if no winner
 */
export function endMatch(match: Match, winnerId: number): void {
    if (!match) return;

    match.endedAt = Date.now();
    match.isRunning = false;

    app.log.debug("Game " + match.matchId + " ended")

    if (winnerId !== -1) {
        app.log.info(`Player ${winnerId} won the match!`);
    }

    //TODO: send stats to sami when the event is catch
    eventEmitter.emit("match-ended", {winnerId: winnerId, matchId: match.matchId});
    MatchManager.getInstance().removeMatch(match);
    return;
}


export function movePaddle(Player_id: number, direction: "up" | "down"): IErrorResponse | ISuccessResponse {
    const match = MatchManager.getInstance().getMatchByPlayerId(Player_id);

    if (!match) return {
        success: false,
        message: "Unable to find a match with this player inside !",
        errorCode: "404"
    } as IErrorResponse;
    const player: Player | undefined = match.getPlayerById(Player_id);

    if (!player) return {
        success: false,
        message: "Unable to find the player in this match !",
        errorCode: "404"
    } as IErrorResponse;
    if (!match.isRunning) return {
        success: false,
        message: "Match is not running yet !",
        errorCode: "400"
    } as IErrorResponse;

    if (direction === "down") {
        player.moveDown();
        return {success: true} as ISuccessResponse;
    } else {
        player.moveUp();
        return {success: true} as ISuccessResponse;
    }
}