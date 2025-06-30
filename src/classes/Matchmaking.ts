// import axios from 'axios';
// import matchInterface from '../interfaces/match.interface';
// import PlayerInterface from '../interfaces/player.interface';
// import { match } from 'assert';
import MatchManager from '../managers/match.manager';
import Match from './Match';
import Player from './Player';

// const BASE = 'http://localhost:3000/api';

const MManager:MatchManager = MatchManager.getInstance();
// @ts-ignore
// class _Player {
    
//     public Player_id: number;
//     public PlayerName: string | null = null;
//     public match_id: Match | null = null;
//     public score: number = 0;
    
//     public inTournament: boolean = true;
//     public designatedNextMatch: number[] = [];
//     public tournamentScore: number = 0;
    
    
//     private interval: NodeJS.Timeout | null = null;
    
    
//     constructor(Player_id: number, PlayerName: string) {
//         this.Player_id = Player_id;
//         this.PlayerName = PlayerName;
//         this.match_id = null;
//         this.selfUpdate();
//     }
//     private selfUpdate(): void {
//         if (this.interval) {
//             clearInterval(this.interval);
//             this.interval = null;
//         }
//         this.interval = setInterval(() => {
//             if (this.Player_id === -1) {
//                 return;
//             }
//             getPlayerInfo(this.Player_id).then(data => {
//                 if (!data) {
//                     console.error(`Player ${this.PlayerName} left the game`);
//                     if (this.match_id) {
//                         this.match_id.PlayerLeft = this.Player_id;
//                         this.match_id.GameMonitoring();
//                     }
//                     clearInterval(this.interval!);
//                     this.interval = null;
//                     fullPurgePlayers(this.Player_id);
//                     console.log(`Player ${this.PlayerName} has been removed from the game.`);
//                     return;
//                 }
//                 this.Player_id = data.Player_id || this.Player_id
//                 this.PlayerName = data.PlayerName || this.PlayerName
//                 this.score = data.score || this.score;
//                 // console.log(`Player ${this.PlayerName} updated: ID=${this.Player_id}, Score=${this.score}`);
//                 // this.match_id = data?.currentmatch_id || null;
//             })
//             console.log(MatchManager.getInstance().matches)
//         }, 1000);
//     }
// }

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
    
    private interval : NodeJS.Timeout | null = null;
    
    public static instance: Matchmaking | null = null;
    
    constructor() {
        this.Matchmakingloop();
    }
    public static getInstance(): Matchmaking {
        if (!Matchmaking.instance) {
            Matchmaking.instance = new Matchmaking();
        }
        return Matchmaking.instance;
    }
    private Matchmakingloop(): void {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        this.interval = setInterval(async () => {
            this.sendToQueue();
            this.sendToTournamentQueue();
            MManager.matches = MManager.matches.filter(match => match.endedAt === -1);
            // const PlayersData = await getPlayers();
            // let newplayer = PlayersData.find(p => !this.players.some(player => player.Player_id === p.Player_id));
            // while (newplayer) {
            //     this.players.push(new Player(newplayer.Player_id, newplayer.PlayerName));
            //     newplayer = PlayersData.find(p => !this.players.some(player => player.Player_id === p.Player_id));
            // }
            console.log(">>>>>>>" , MManager.players.length     , " players");
            console.log(">>>>>>>" , MManager.queue.length       , " players in queue");
            console.log(">>>>>>>" , MManager.tournamentQueue.length  , " players in tournament");
            if (MManager.players.length === 0) {
                console.log("No players available for matchmaking.");
                return;
            }
            
            this.designMatchNormal();
            this.designMatchTournament()
            // this.purgeMatches();
            const MonitoringNormalTable = MManager.matches.map(match => {
                return {
                    normalMatch: match.match_id,
                    players: match.players.map(p => p.PlayerName+ ` ${p.Player_id}`),
                    ended: match.endedAt !== -1 ? new Date(match.endedAt).toLocaleString() : 'In Progress',
                    queue: MManager.queue.map(p => p.PlayerName+ ` ${p.Player_id}`),
                };
            });
            console.table(MonitoringNormalTable);
            
            const MonitoringTournamentTable = MManager.TournamentMatches.map(match => {
                return {
                    tournamentMatch: match.match_id,
                    players: match.players.map(p => p.PlayerName+ ` ${p.Player_id}`),
                    ended: match.endedAt !== -1 ? new Date(match.endedAt).toLocaleString() : 'In Progress',
                    queue: MManager.tournamentQueue.map(p => p.PlayerName+ ` ${p.Player_id}`),
                    nextMatch: match.players.map(p=> p.designatedNextMatch).join(', '),
                    
                    
                };
            });
            console.table(MonitoringTournamentTable);
        }, 1000);
        
    }
    
    // public pushPairsFrom(where: Player[], to: Match[]): void {
    //     // let p1: Player | undefined = undefined;
    //     // let p2: Player | undefined = undefined;
    //     while (where.length >= 2) {
            
    //         const p1 = where.shift();
    //         const p2 = where.shift();
    //         console.log(`Pairing players: ${p1?.PlayerName} and ${p2?.PlayerName}`);
    //         if (p1 && p2){
    //             let m = new Match(5, Math.floor(Math.random() * 1000000));
    //             m.pushPlayer(p1);
    //             m.pushPlayer(p2);
    //             to.push(m);
    //         }
    //     }
    //     // if (tmp) this.queue.push(tmp);
    // }
    public designMatchNormal(): void {
        // this.queue = this.queue.filter(p => p.inTournament === false);
        while (MManager.queue.length >= 2) {
            
            const p1 = MManager.queue.shift();
            const p2 = MManager.queue.shift();
            console.log(`Pairing players: ${p1?.PlayerName} and ${p2?.PlayerName}`);
            if (p1 && p2){
                let m = new Match(5, Math.floor(Math.random() * 1000000));
                m.pushPlayer(p1);
                m.pushPlayer(p2);
                MManager.matches.push(m);
            }
        }


        // this.pushPairsFrom(MManager.queue, MManager.matches);
        this.purgeMatches("normal");
        // this.push(MManager.matches);
    }
    public designMatchTournament(): void {
        // this.tournament = this.players.filter(p => p.inTournament === true);
        // if (this.tournamentQueue.length % 2 !== 0) {
        //     console.log("Waiting for a sufficient number of players in tournament");
        //     return;
        // }
        for (let i = 0; i < MManager.tournamentQueue.length; i++) {
            // let indexp1 = i  % MManager.tournamentQueue.length;
            let index = (i + 1) % MManager.tournamentQueue.length;
            if (MManager.tournamentQueue[index]?.designatedNextMatch === -1) {
                MManager.tournamentQueue[index].designatedNextMatch = MManager.tournamentQueue[i].Player_id;
            }
            
        }
        while (MManager.tournamentQueue.length >= 2) {
            
            const p1 = MManager.tournamentQueue.shift();
            const p2 = MManager.tournamentQueue.shift();
            console.log(`Pairing players: ${p1?.PlayerName} and ${p2?.PlayerName}`);
            if (p1 && p2){
                let m = new Match(5, Math.floor(Math.random() * 1000000));
                m.pushPlayer(p1);
                m.pushPlayer(p2);
                MManager.TournamentMatches.push(m);
            }
        }


        // this.pushPairsFrom(MManager.tournamentQueue, MManager.TournamentMatches);
        console.log(">>>>>>>>>> Tournament Matches: ", MManager.TournamentMatches);
        // if (MManager.TournamentMatches.length > 1) {
        //     for (let i = 0; i < MManager.TournamentMatches.length -1 ; i++) {
        //         let indexp1 = i  % MManager.TournamentMatches.length;
        //         let indexp2 = i + 1 % MManager.TournamentMatches.length;
        //         console.log (">>>>>>>>>>>>>" , indexp1, indexp2, MManager.TournamentMatches.length)
        //         console.log("here", MManager.TournamentMatches[indexp2].players[0])
        //         if (!MManager.TournamentMatches[indexp2].players[0].Player_id){
                    
        //         }
        //         MManager.TournamentMatches[indexp1].players[0].designatedNextMatch.push(MManager.TournamentMatches[indexp2].players[0]?.Player_id || -1);
        //         MManager.TournamentMatches[indexp2].players[0].designatedNextMatch.push(MManager.TournamentMatches[indexp1].players[0]?.Player_id || -1);
        //         MManager.TournamentMatches[indexp1].players[1].designatedNextMatch.push(MManager.TournamentMatches[indexp2].players[1]?.Player_id || -1);
        //         MManager.TournamentMatches[indexp2].players[1].designatedNextMatch.push(MManager.TournamentMatches[indexp1].players[1]?.Player_id || -1);
                
        //     }
        // }
        // this.push(MManager.TournamentMatches);
        // this.purgeMatches(this.TournamentMatches);
    }
    
    private sendToTournamentQueue(): void {
        MManager.tournamentQueue = MManager.players.filter(player => player.inTournament === true);
        MManager.tournamentQueue = MManager.tournamentQueue.filter(player => player.match_id === null && player.Player_id !== -1);
        console.log(">>>>>>> HERE" , MManager.tournamentQueue.length, " players in tournament");
        MManager.tournamentQueue = MManager.tournamentQueue.sort((a, b) => a.Player_id - b.Player_id)
    }
    
    private sendToQueue(): void{
        let tmp: Player[] = [];
        tmp = MManager.players.filter(player => player.match_id === null && player.Player_id !== -1);
        tmp = MManager.players.filter(player => player.inTournament === false && player.match_id === null && player.Player_id !== -1);
        MManager.queue.push(...tmp);
        MManager.matches.forEach(match => {
            if (match.players.length === 2) {return}
            else {
                MManager.queue.push(...match.players);
                match.players.forEach(player => player.match_id = null)
                MManager.matches = MManager.matches.filter(m => m !== match);
            }
        });
        
        MManager.queue.forEach((player, index) => {
            if (MManager.queue.findIndex(p =>player.PlayerName === p.PlayerName) !== index) {
                MManager.queue.splice(index, 1);
            }
        })
        
    }
    //@ts-ignore
    private purgeMatches(which: "normal" | "Tournament"): void {
        if (which === "normal") {
            MManager.matches = MManager.matches.filter(match => match.endedAt === -1);
            MManager.matches = MManager.matches.filter(match => match.players.length !== 0 && match.players.length !== 1);
            MManager.queue = MManager.queue.filter(player => player.Player_id !== -1);
        }
        else if (which === "Tournament") {
            MManager.TournamentMatches = MManager.TournamentMatches.filter(match => match.endedAt === -1);
            MManager.TournamentMatches = MManager.TournamentMatches.filter(match => match.players.length !== 0 && match.players.length !== 1);
            MManager.tournamentQueue = MManager.tournamentQueue.filter(player => player.Player_id !== -1);
        }
    }
    
    // public push(where: Match[]):void {
    //     const matchesToPush = where.filter(match => match.players.length === 2);
    //     // console.log(`Pushing ${matchesToPush[0].match_id} matches to the server.`);
    //     matchesToPush.forEach(async match => {
    //         if (!match.EXISTS){
    //             await createMatch(5, match.match_id).then(async() => {
    //                 match.EXISTS = true;
    //                 await placeSeated(match.match_id, match.players[0].Player_id).then(async () => {
    //                     await placeSeated(match.match_id, match.players[1].Player_id).catch(() => {
    //                         console.error(`Error placing player ${match.players[1].PlayerName} in match ${match.match_id}:`);
    //                     });
    //                 }).catch(() => {
    //                     console.error(`Error placing player ${match.players[0].PlayerName} in match ${match.match_id}:`);
    //                 });
                    
    //             }).catch(error => {
    //                 console.error(`Error creating match ${match.match_id}:`, error);
    //             });
    //         }
    //     });
    // }
}