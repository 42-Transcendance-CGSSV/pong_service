import {IBasicResponse} from "../interfaces/response.interface";
import MatchManager from "../managers/match.manager";
import Match from "../classes/Match";


export function playerJoinMatch(playerName: string, playerId: string, matchId: string, AI: boolean = false): IBasicResponse {
    const match = MatchManager.getInstance().getMatchById(matchId)

    if (!match) return {success: false, message: "Unable to find the match"} as IBasicResponse;
    if (match.isExpired()) return {success: false, message: "Match expired"} as IBasicResponse;

    match.addPlayer(playerName, playerId, AI);
    return {success: true, message: "Player joined the match"} as IBasicResponse;
}


export function getMatchData(matchId: string): IBasicResponse {
    const match = MatchManager.getInstance().getMatchById(matchId);
    if (!match) return {success: false, message: "Unable to find the match"} as IBasicResponse;

    return {success: true, message: "Match found", data: match} as IBasicResponse;
}


export function getPlayerData(playerId: string): IBasicResponse {

    const match = MatchManager.getInstance().getMatchByPlayerId(playerId);
    if (!match) return {
        success: false,
        message: "Unable to find a match with this player inside !"
    } as IBasicResponse;
    const player = match.getPlayerById(playerId);
    if (!player) return {success: false, message: "Unable to find the player in this match !"} as IBasicResponse;
    return {success: true, message: "Player found", data: player.ExportPlayerInfo()} as IBasicResponse;
}


export function togglePauseMatch(matchId: string): IBasicResponse {
    const match = MatchManager.getInstance().getMatchById(matchId);
    if (!match) return {success: false, message: "Unable to find the match"} as IBasicResponse;


    match.pausedAt = match.pausedAt === -1 ? Date.now() : -1;
    match.isRunning = !match.isRunning;

    const message = match.isRunning ? `Game ${matchId} resumed` : `Game ${matchId} paused`;

    console.log(message)
    return {success: true, message: message} as IBasicResponse;
}

export function startMatch(match: Match): IBasicResponse {
    match.startedAt = Date.now();
    match.isRunning = true;

    const message = "Game " + match.matchID + " started";

    console.log(message)
    return {success: true, message: message} as IBasicResponse;
}

export function endMatch(matchId: string): IBasicResponse {
    const match = MatchManager.getInstance().getMatchById(matchId);
    if (!match) return {success: false, message: "Unable to find the match"} as IBasicResponse;

    match.startedAt = -1;
    match.isRunning = false;

    const message = "Game " + matchId + " ended";

    console.log(message)
    //TODO: send stats to sami
    MatchManager.getInstance().removeMatch(match);
    return {success: true, message: message} as IBasicResponse;
}


export function movePaddle(playerId: string, direction: "up" | "down"): IBasicResponse {
    const match = MatchManager.getInstance().getMatchByPlayerId(playerId);
    if (!match) return {success: false, message: "Unable to find a match with this player inside !"} as IBasicResponse;

    const player = match.getPlayerById(playerId);
    if (!player) return {success: false, message: "Unable to find the player in this match !"} as IBasicResponse;

    direction === "down" ? player.moveDown() : player.moveUp();
    return {success: true, message: "Paddle has been moved " + direction} as IBasicResponse;
}