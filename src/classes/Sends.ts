import MatchManager from '../managers/match.manager';
 //  import matchInterface from '../interfaces/match.interface';
 //  import PlayerInterface from '../interfaces/player.interface';
 
 
 export async function createMatch(match_id:number): Promise<void> {
    try {
        const match = MatchManager.getInstance().createMatch(5, match_id);
        if (!match) {
            console.error('Match creation failed');
            return;
        }
    } catch (error) {
        console.error('Error creating match');
    }
}

export async function placeSeated(matchId: number, user_id: number): Promise<void> {
    try {
        if (MatchManager.getInstance().seatPlayer(user_id, matchId)) {
            console.log(`Player ${user_id} seated in match ${matchId}`);
        }
        else {
            console.error(`Player ${user_id} could not be seated in match ${matchId}`);
        }
    } catch (_error) {
        console.error(`cant seat player: ${user_id} on match ${matchId}`);
    }
}