import Match from "../classes/Match";
import Player from "../classes/Player";
import Ball from "../classes/Ball";

export default class MatchManager {

    public readonly matches: Match[] = [];
    private static instance: MatchManager | null = null;

    public createMatch(scoreGoal: number): Match {
        let match = new Match(scoreGoal);
        this.matches.push(match);
        return match;
    }

    public addPlayersToMatch(match: Match, players: Player[]): void {
        if (!this.matches.includes(match)) throw new Error("Match not found in MatchManager.");

        for (const player of players) {
            match.addPlayer(player.PlayerName, player.AI);
        }
    }

    public removeMatch(match: Match): void {
        if (this.matches.includes(match)) {
            this.matches.splice(this.matches.indexOf(match), 1);
        }
    }

    public addPlayerToMatch(player: Player, matchId: string): void {
        const match = this.getMatchById(matchId);
        if (!match) {
            throw new Error(`Match with ID ${matchId} not found.`);
        }
        match.addPlayer(player.PlayerName, player.AI);
    }

    public countMatches(): number {
        return this.matches.length;
    }

    public getOpenMatches(): Match[] {
        return this.matches.filter(match => match.players.length < 2 && !match.isRunning);
    }

    public getMatchById(matchID: string): Match | undefined {
        return this.matches.find(match => match.matchID === matchID);
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

    public getMatchByPlayerId(playerId: string): Match | null {
        for (const match of this.matches) {
            if (!match)
                continue;
            if (match.players.find(player => player.PlayerID === playerId))
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