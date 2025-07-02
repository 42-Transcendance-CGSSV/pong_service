import MatchManager from '../managers/match.manager';
import {app} from "../app";
//  import matchInterface from '../interfaces/match.interface';
//  import PlayerInterface from '../interfaces/player.interface';


export async function createMatch(match_id: number): Promise<void> {
    try {
        const match = MatchManager.getInstance().createMatch(5, match_id);
        if (!match) {
            app.log.error('Match creation failed');
            return;
        }
    } catch (error) {
        app.log.error('Error creating match');
    }
}

export async function placeSeated(matchId: number, user_id: number): Promise<void> {
    try {
        if (MatchManager.getInstance().seatPlayer(user_id, matchId)) {
            app.log.info(`Player ${user_id} seated in match ${matchId}`);
        } else {
            app.log.error(`Player ${user_id} could not be seated in match ${matchId}`);
        }
    } catch (_error) {
        app.log.error(`cant seat player: ${user_id} on match ${matchId}`);
    }
}