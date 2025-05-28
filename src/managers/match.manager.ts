import Match from "../classes/Match";
import Player from "../classes/Player";
import Ball from "../classes/Ball";

export default class MatchManager {

    public readonly matches: Match[] = [];
    private static instance: MatchManager | null = null;
    private matchCounter: number = 0;

    public createMatch(scoreGoal: number): Match {
        let match = new Match(scoreGoal);
        this.matches.push(match);
        this.matchCounter++;
        return match;
    }

    public removeMatch(match: Match): void {
        if (this.matches.includes(match)) {
            this.matches.splice(this.matches.indexOf(match), 1);
        }
    }

    public countMatches(): number {
        return this.matches.length;
    }

    public getOpenMatches(): Match[] {
        return this.matches.filter(match => match.players.length < 2 && !match.isRunning);
    }

    public getMatchById(match_id: number): Match | undefined {
        let tmp:Match | undefined = undefined;
        for (const match of this.matches) {
            if (!match)
                continue;
            // console.log("Checking match with ID:", typeof(match.match_id) + " against " + typeof(match_id));
            if (match.match_id === match_id as number) {
                tmp = match;
                // console.log("Match found with ID:", match.match_id);
                break;
            }
        }
        return tmp;
    }

    public getMatchByBall(ball: Ball): Match | null {
        for (const match of this.matches) {
            if (!match)
                continue;
            if (match.isSameBall(ball))
                return match;
        }
        return null;
    }

    public getMatchByPlayer(player: Player): Match | null {
        for (const match of this.matches) {
            if (!match)
                continue;
            if (match.players.includes(player))
                return match;
        }
        return null;
    }

    public getMatchByPlayer_id(Player_id: number): Match | null {
        for (const match of this.matches) {
            if (!match)
                continue;
            if (match.players.find(player => player.Player_id === Player_id))
                return match;
        }
        return null;
    }


    public getPlayersByBall(ball: Ball): Player[] | null {
        let match = this.getMatchByBall(ball);
        if (!match)
            return null;
        if (!match.players)
            return null;
        return match.players;
    }

    public static getInstance(): MatchManager {
        return this.instance ? this.instance : (this.instance = new MatchManager());
    }

}