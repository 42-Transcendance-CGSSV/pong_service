import MatchManager from "../managers/match.manager";
import Match, {AiNeeds} from "../classes/Match";
import Player from "../classes/Player";
import {ScoreRegistryInterface} from "../interfaces/score.registry.interface";
import {app} from "../app";
import {IErrorResponse, ISuccessResponse} from "../interfaces/response.interface";

export function getMatchData(match_id: number): ISuccessResponse | IErrorResponse {
    const match = MatchManager.getInstance().getMatchById(match_id);
    if (!match) return {success: false, message: "match does not exist !", errorCode: "404"} as IErrorResponse;

    return {success: true, message: "Match found", data: match.exportRenderInfo(), errorCode: "200"} as ISuccessResponse;
}

export function getAiNeeds(): AiNeeds[] | null {
    const match: Match[] = Array.from(MatchManager.getInstance().matches.values())
    const payload: AiNeeds[] = [];
    if (!match) return null
    match.forEach((m) => {
        const needs = m.exportAiNeeds();
        if (needs)
            needs.forEach((n) => payload.push(n))
    })
    if (payload.length === 0) return null
    return payload;
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


export function togglePauseMatch(match_id: number): ISuccessResponse | IErrorResponse  {
    const match = MatchManager.getInstance().getMatchById(match_id);
    if (!match) return {success: false, message: "match does not exist !", errorCode: "404"} as IErrorResponse;

    match.pausedAt = match.pausedAt === -1 ? Date.now() : -1;
    match.isRunning = !match.isRunning;

    const message = match.isRunning ? `Game ${match_id} resumed` : `Game ${match_id} paused`;

    app.log.debug(message)
    return {success: true, message: message} as ISuccessResponse;
}

export function startMatch(match: Match): ISuccessResponse {
    match.startedAt = Date.now();
    match.isRunning = true;

    const message = "Game " + match.matchId + " started";

    app.log.debug(message)
    return {success: true, message: message} as ISuccessResponse;
}

export function endMatch(match: Match): ISuccessResponse | IErrorResponse {
    if (!match) return {success: false, message: "match does not exist !", errorCode: "404"} as IErrorResponse;

    match.startedAt = -1;
    match.isRunning = false;

    const message = "Game " + match.matchId + " ended";

    app.log.debug(message)
    //TODO: send stats to sami
    MatchManager.getInstance().removeMatch(match);
    return {success: true, message: message} as ISuccessResponse;
}


export function movePaddle(Player_id: number, direction: "up" | "down"): IErrorResponse | ISuccessResponse {
    const match = MatchManager.getInstance().getMatchByPlayerId(Player_id);

    if (!match) return {success: false, message: "Unable to find a match with this player inside !", errorCode: "404"} as IErrorResponse;
    const player: Player | undefined = match.getPlayerById(Player_id);

    if (!player) return {success: false, message: "Unable to find the player in this match !", errorCode: "404"} as IErrorResponse;
    if (!match.isRunning) return {success: false, message: "Match is not running yet !", errorCode: "400"} as IErrorResponse;

    if (direction === "down") {
        player.moveDown();
        return {success: true} as ISuccessResponse;
    }
    else {
        player.moveUp();
        return {success: true} as ISuccessResponse;
    }
}