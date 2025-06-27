import {IBasicResponse} from "../interfaces/response.interface";
import MatchManager from "../managers/match.manager";
import Match, {AiNeeds} from "../classes/Match";
import Player from "../classes/Player";
import {score_registry_interface} from "../interfaces/score.registry.interface";

// TODO: remake
// export function playerJoinMatch(playerName: string, Player_id: number, match_id: number, AI: boolean = false, isTraining: boolean = false): IBasicResponse {
//     const match = MatchManager.getInstance().getMatchById(match_id)

//     if (!match) return {success: false, message: "Unable to find the match"} as IBasicResponse;
//     if (match.isExpired()) return {success: false, message: "Match expired"} as IBasicResponse;

//     match.addPlayer(playerName, Player_id, AI, isTraining);
//     return {success: true, message: "Player joined the match"} as IBasicResponse;
// }


export function getMatchData(match_id: number): IBasicResponse {
    const match = MatchManager.getInstance().getMatchById(match_id);
    if (!match) return {success: false, message: "match does not exist !", errorCode: "404"} as IBasicResponse;
        // return {success: false, message: "Unable to find the match"} as IBasicResponse;
    
    // console.log("Match data retrieved for match_id:", match_id, "INFO", match.ExportMatchInfo());
    return {success: true, message: "Match found", data: match.exportRenderInfo(), errorCode:"200"} as IBasicResponse;
}
export function getAiNeeds():  AiNeeds[] | null {
    const match: Match[] = MatchManager.getInstance().matches
    const payload: AiNeeds[] = [];
    if (!match) return null
    match.forEach((m) => {
        const needs = m.exportAiNeeds();
        if (needs)
            needs.forEach((n) => payload.push(n))
    })
    // console.log("Match data retrieved for match_id:", match_id, "INFO", match.ExportMatchInfo());
    if (payload.length === 0) return null
    return payload;
}

export function gettainingData():  score_registry_interface[] | null {
    const match: Match[] = MatchManager.getInstance().matches
    const payload: score_registry_interface[] = [];
    if (!match) return null
    match.forEach((m) => {
        const needs = m.exportRegistry();
        if (needs){
            needs.forEach((n) => {
                if (n)
                    payload.push(n)
            })

        }
    })
    // console.log("Match data retrieved for match_id:", match_id, "INFO", match.ExportMatchInfo());
    if (payload.length === 0) return null
    return payload;
}

export function getMatchById(match_id: number) :Match|null{
    const match = MatchManager.getInstance().getMatchById(match_id);
    if (!match) return null
    return match
}

// export function getBallData(match_id: number): IBasicResponse {
//     const match = MatchManager.getInstance().getMatchById(match_id);
//     if (!match) return {success: false, message: "Unable to find the match"} as IBasicResponse;
    
//     return {success: true, message: "Match found", data: match.ball.ExportBallInfo()} as IBasicResponse;
// }


export function getPlayerData(Player_id: number): IBasicResponse {

    const match = MatchManager.getInstance().getMatchByPlayer_id(Player_id);
    if (!match)  return {success: false, message: "match does not exist !", errorCode: "404"} as IBasicResponse;

    const player = match.getPlayerById(Player_id);
    if (!player) return {success: false, message: "Unable to find the player !", errorCode: "404"} as IBasicResponse;
    return {success: true, message: "Player found", data: player.ExportPlayerInfo()} as IBasicResponse;
}


export function togglePauseMatch(match_id: number): IBasicResponse {
    const match = MatchManager.getInstance().getMatchById(match_id);
    if (!match) return {success: false, message: "match does not exist !", errorCode: "404"} as IBasicResponse;
        // return {success: false, message: "Unable to find the match"} as IBasicResponse;


    match.pausedAt = match.pausedAt === -1 ? Date.now() : -1;
    match.isRunning = !match.isRunning;

    const message = match.isRunning ? `Game ${match_id} resumed` : `Game ${match_id} paused`;

    console.log(message)
    return {success: true, message: message} as IBasicResponse;
}

export function startMatch(match: Match): IBasicResponse {
    match.startedAt = Date.now();
    match.isRunning = true;

    const message = "Game " + match.match_id + " started";

    console.log(message)
    return {success: true, message: message} as IBasicResponse;
}

export function endMatch(match_id: number): IBasicResponse {
    const match = MatchManager.getInstance().getMatchById(match_id);
    if (!match) return {success: false, message: "match does not exist !", errorCode: "404"} as IBasicResponse;
        // return {success: false, message: "Unable to find the match"} as IBasicResponse;

    match.startedAt = -1;
    match.isRunning = false;

    const message = "Game " + match_id + " ended";

    console.log(message)
    //TODO: send stats to sami
    MatchManager.getInstance().removeMatch(match);
    return {success: true, message: message} as IBasicResponse;
}


export function movePaddle(Player_id: number, direction: "up" | "down"): IBasicResponse | null {
    const match = MatchManager.getInstance().getMatchByPlayer_id(Player_id);
    if (!match) return {success: false, message: "Unable to find a match with this player inside !", errorCode: "404"} as IBasicResponse;
    const player:Player|undefined = match.getPlayerById(Player_id);
    if (!player) return {success: false, message: "Unable to find the player in this match !", errorCode: "404"} as IBasicResponse;
    if (!match.isRunning) return {success: false, message: "Match is not running yet !", errorCode: "400"} as IBasicResponse;

    direction === "down" ? player.moveDown() : player.moveUp();
    // console.log(`Player ${player.PlayerName} moved paddle ${direction} in match ${match.match_id}`);
    // return {success: true, message: "Paddle has been moved " + direction, errorCode:"200"} as IBasicResponse;
    return null; // TODO: remove this null return
}