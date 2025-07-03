// import matchInterface from '../interfaces/match.interface';
// import PlayerInterface from '../interfaces/player.interface';
// import { match } from 'assert';
import MatchManager from '../managers/match.manager';
import Match from './Match';
import Player from './Player';
import {app} from "../app";
const MManager: MatchManager = MatchManager.getInstance();


export function fullPurgePlayers(Player_id: number) {
    // if (Player_id === -1) {return;}
    MatchManager.getInstance().players = MatchManager.getInstance().players.filter(player => player.Player_id !== Player_id);
    MatchManager.getInstance().queue = MatchManager.getInstance().players.filter(player => player.Player_id !== Player_id);
    MatchManager.getInstance().tournamentQueue = MatchManager.getInstance().players.filter(player => player.Player_id !== Player_id);
    MatchManager.getInstance().matches.forEach(match => {
        match.players = match.players.filter(player => player.Player_id !== Player_id);
    });
    MatchManager.getInstance().matches = MatchManager.getInstance().matches.filter(m => m.players.length > 0);
    MatchManager.getInstance().TournamentMatches.forEach(match => {
        match.players = match.players.filter(player => player.Player_id !== Player_id);
    });
    MatchManager.getInstance().TournamentMatches = MatchManager.getInstance().TournamentMatches.filter(m => m.players.length > 0);
}

export class Matchmaking {

    public static instance: Matchmaking | null = null;
    private interval: NodeJS.Timeout | null = null;

    constructor() {
        this.MatchmakingLoop();
    }

    public static getInstance(): Matchmaking {
        if (!Matchmaking.instance) {
            Matchmaking.instance = new Matchmaking();
        }
        return Matchmaking.instance;
    }

    public designMatchNormal(): void {
        // this.queue = this.queue.filter(p => p.inTournament === false);
        while (MManager.queue.length >= 2) {

            const p1 = MManager.queue.shift();
            const p2 = MManager.queue.shift();
            app.log.info(`Pairing players: ${p1?.PlayerName} and ${p2?.PlayerName}`);
            if (p1 && p2) {
                let m = new Match(5000, Math.floor(Math.random() * 1000000));
                p1.side = 0;
                m.pushPlayer(p1);
                p2.side = 1;
                m.pushPlayer(p2);
                MManager.matches.push(m);
            }
        }
        this.purgeMatches("normal");
    }


    public designMatchTournament(): void {
        for (let i = 0; i < MManager.tournamentQueue.length; i++) {
            let index = (i + 1) % MManager.tournamentQueue.length;
            if (MManager.tournamentQueue[index]?.designatedNextMatch === -1) {
                MManager.tournamentQueue[index].designatedNextMatch = MManager.tournamentQueue[i].Player_id;
            }
        }
        while (MManager.tournamentQueue.length >= 2) {
            const p1 = MManager.tournamentQueue.shift();
            const p2 = MManager.tournamentQueue.shift();
            app.log.debug(`Pairing players: ${p1?.PlayerName} and ${p2?.PlayerName}`);
            if (p1 && p2) {
                let m = new Match(5000, Math.floor(Math.random() * 1000000));
                m.pushPlayer(p1);
                m.pushPlayer(p2);
                MManager.TournamentMatches.push(m);
            }
        }
        this.purgeMatches("Tournament");
    }

    private MatchmakingLoop(): void {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        this.interval = setInterval(async () => {
            this.sendToQueue();
            this.sendToTournamentQueue();
            MManager.matches = MManager.matches.filter(match => match.endedAt === -1);
            app.log.debug(`>>>>>>>>>> Players: ${MManager.players.length}`);
            app.log.debug(`>>>>>>> Players in queue: ${MManager.queue.length}`);
            app.log.debug(`>>>>>>> Players in tournament: ${MManager.tournamentQueue.length}`);
            if (MManager.players.length === 0) {
                app.log.debug("No players available for matchmaking.");
                return;
            }

            this.designMatchNormal();
            this.designMatchTournament()
            // this.purgeMatches();
            const MonitoringNormalTable = MManager.matches.map(match => {
                return {
                    normalMatch: match.match_id,
                    players: match.players.map(p => p.PlayerName + ` ${p.Player_id}`),
                    ended: match.endedAt !== -1 ? new Date(match.endedAt).toLocaleString() : 'In Progress',
                    queue: MManager.queue.map(p => p.PlayerName + ` ${p.Player_id}`),
                };
            });
            console.table(MonitoringNormalTable);

            const MonitoringTournamentTable = MManager.TournamentMatches.map(match => {
                return {
                    tournamentMatch: match.match_id,
                    players: match.players.map(p => p.PlayerName + ` ${p.Player_id}`),
                    ended: match.endedAt !== -1 ? new Date(match.endedAt).toLocaleString() : 'In Progress',
                    queue: MManager.tournamentQueue.map(p => p.PlayerName + ` ${p.Player_id}`),
                    nextMatch: match.players.map(p => p.designatedNextMatch).join(', '),


                };
            });
            console.table(MonitoringTournamentTable);
        }, 1000);

    }

    private sendToTournamentQueue(): void {
        MManager.tournamentQueue = MManager.players.filter(player => player.inTournament);
        MManager.tournamentQueue = MManager.tournamentQueue.filter(player => player.match_id === null && player.Player_id !== -1);
        MManager.tournamentQueue = MManager.tournamentQueue.sort((a, b) => a.Player_id - b.Player_id)
    }

    private sendToQueue(): void {
        let tmp: Player[] = [];
        tmp = MManager.players.filter(player => player.match_id === null && player.Player_id !== -1);
        tmp = MManager.players.filter(player => !player.inTournament && player.match_id === null && player.Player_id !== -1);
        MManager.queue.push(...tmp);
        MManager.matches.forEach(match => {
            if (match.players.length === 2) {
                return
            } else {
                MManager.queue.push(...match.players);
                match.players.forEach(player => player.match_id = null)
                MManager.matches = MManager.matches.filter(m => m !== match);
            }
        });

        MManager.queue.forEach((player, index) => {
            if (MManager.queue.findIndex(p => player.PlayerName === p.PlayerName) !== index) {
                MManager.queue.splice(index, 1);
            }
        })

    }

    private purgeMatches(which: "normal" | "Tournament"): void {
        if (which === "normal") {
            MManager.matches = MManager.matches.filter(match => match.endedAt === -1);
            MManager.matches = MManager.matches.filter(match => match.players.length !== 0 && match.players.length !== 1);
            MManager.queue = MManager.queue.filter(player => player.Player_id !== -1);
        } else if (which === "Tournament") {
            MManager.TournamentMatches = MManager.TournamentMatches.filter(match => match.endedAt === -1);
            MManager.TournamentMatches = MManager.TournamentMatches.filter(match => match.players.length !== 0 && match.players.length !== 1);
            MManager.tournamentQueue = MManager.tournamentQueue.filter(player => player.Player_id !== -1);
        }
    }
}