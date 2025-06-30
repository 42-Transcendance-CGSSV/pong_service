 import matchInterface from '../interfaces/match.interface';
 import PlayerInterface from '../interfaces/player.interface';
 import MatchManager from '../managers/match.manager';
 
 
 export async function getPlayers(): Promise<PlayerInterface[]> {
    try {
        const players:PlayerInterface[] = MatchManager.getInstance().players;
        if (players.length > 0) {
            return players;
        }
        return [];
    } catch (error) {
        console.error('Error fetching players !' + 404);
        return [];
    }
}

export async function getPlayerInfo(playerId: number): Promise<PlayerInterface | null> {
    try {
        const players = MatchManager.getInstance().players;
        if (players.length === 0) {
            console.error("players not found")
        }
        const player = players.find(p => p.Player_id === playerId);
        if (!player) {
            console.error(`Player with user_id ${playerId} not found`);
        }
        if (player) {
            return player;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error fetching player info ! :' + 404);
        return null;
    }
}

export async function getMatches(): Promise<matchInterface[]> {
    try {
        const matches = MatchManager.getInstance().matches;
        if (matches.length === 0) {
            // reply.send({success: false, message: "No matches found"} as IBasicResponse);
            console.error("match not found")
        }
        if (matches.length > 0) {
            return matches;
        }
        return [];
    } catch (error) {
        console.error('Error fetching matches !' );
        return [];
    }
}

export async function getMatchHealth(match_id:number): Promise<boolean> {
    try {
        const matches = MatchManager.getInstance().matches;
        if (matches.length === 0) {
            // reply.send({success: false, message: "No matches found"} as IBasicResponse);
            console.error("match not found")
            return false
        }
        const match = matches.find(m => m.match_id === match_id);
        if (!match) {
            console.error(`Match with match_id ${match_id} not found`);
            return false;
        }
        if (match.endedAt === -1) {
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error fetching matches !' );
        return false;
    }
}

