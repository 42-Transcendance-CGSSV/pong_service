import matchInterface from "../interfaces/match.interface";
import Ball from "./Ball";
import Player from "./Player";
import {env} from "../utils/environment";
import MatchExportInterface from "../interfaces/match.export.interface";
import {score_registry_interface} from "../interfaces/score.registry.interface";
import MatchManager from "../managers/match.manager";
import {app} from "../app";

export interface AiNeeds {
    playerID: number,
    myScore: number,
    ballX: number,
    ballY: number,
    ballSpeedX: number,
    ballSpeedY: number,
    myPosition: number,
    mySide: number,
    isTraining: boolean,
}

class Match implements matchInterface {
    public isRunning: boolean = false;
    public readonly match_id: number;
    public readonly ball: Ball;
    public players: Player[] = [];
    public readonly scoreGoal: number;
    public startedAt: number;
    public pausedAt: number = -1;
    public endedAt: number;
    public winner_id: number = -1;

    public interval: NodeJS.Timeout | null = null;
    public winner: Player | undefined = undefined;
    public PlayerLeft: number = -1;

    // designatedNextMatch[0]


    public constructor(scoreGoal: number, match_id: number) {
        this.match_id = match_id;
        this.ball = new Ball();
        this.scoreGoal = scoreGoal;
        this.startedAt = -1;
        this.endedAt = -1;
        this.winner_id = -1;

        // this.match_id = this.match_id++; // TODO: Replace with a proper ID generator
    }

    public resetMatch(): void {
        this.isRunning = false;
        for (const player of this.players) {
            player.score = 0;
            player.PaddlePos = env.CANVAS_HEIGHT / 2 - env.PLAYER_PADDLE_HEIGHT / 2;
        }
        this.ball.ballX = env.CANVAS_WIDTH / 2;
        this.ball.ballY = env.CANVAS_HEIGHT / 2;
        this.ball.lastToHit = undefined;
    }

    public checkForWinner(): void {
        for (const player of this.players) {
            if (player.score >= this.scoreGoal) {
                this.isRunning = false;
                this.endedAt = Date.now();
                this.winner_id = player.Player_id;
                app.log.info(`Player ${player.PlayerName} won the match!`);
                this.resetMatch();
                return;
            }
        }
    }

    public addPlayer(Player: Player): boolean {
        // if (TRAINING_MODE){
        //     Player.side = 0;
        //     return;
        // }
        this.players.length === 1 ? Player.side = 0 : Player.side = 1;
        Player.currentmatch_id = this.match_id;
        const check = this.players.length;
        if (this.players.push(Player) === check + 1) {
            return true;
        }
        return false;
    }

    public getPlayersInMatch(): Player[] {
        return this.players;
    }

    public playerIsInMatch(player: Player): boolean {
        return this.players.includes(player);
    }

    public getPlayerById(Player_id: number): Player | undefined {
        return this.players.find(player => player.Player_id === Player_id);
    }


    public isExpired(): boolean {
        return this.startedAt + 60 * 60000 > Date.now();
    }

    public isSameBall(ball: Ball): boolean {
        return ball === this.ball;
    }

    public ExportMatchInfo(): MatchExportInterface {
        return {
            isRunning: this.isRunning,
            match_id: this.match_id,
            ball: this.ball.ExportBallInfo(),
            players: this.players.map(player => player.ExportPlayerInfo()),
            scoreGoal: this.scoreGoal,
            startedAt: this.startedAt,
            pausedAt: this.pausedAt,
            endedAt: this.endedAt,
            winner_id: this.winner_id
        };
    }

    public exportRenderInfo() {
        return {
            ball: {
                relativeBallX: this.ball.ExportBallInfo().relativeBallX,
                relativeBallY: this.ball.ExportBallInfo().relativeBallY
            },
            players: this.players.map(player => player.ExportRenderInfo())
        }
    }

    // playerID: string ,
    // myScore: number,
    // ballX: number,
    // ballY: number,
    // ballSpeedY: number,
    // myPosition: number,
    // PaddleHeight: number,
    // mySide: number

    public exportAiNeeds(): AiNeeds[] | null {
        const player: Player[] | undefined = this.players.filter(Player => Player.AI)

        let ret: AiNeeds[] | null = null;
        if (player.length > 0) {
            ret = player.map((player: Player) => ({
                playerID: player.Player_id,
                myScore: player.score,
                ballX: this.ball.ExportBallInfo().relativeBallX,
                ballY: this.ball.ExportBallInfo().relativeBallY,
                ballSpeedX: this.ball.ExportBallInfo().ballSpeedX,
                ballSpeedY: this.ball.ExportBallInfo().ballSpeedY,
                myPosition: player.ExportRenderInfo().relativeY,
                mySide: player.side,
                isTraining: player.isTraining,
            }))
        }
        return ret;
    }

    public exportRegistry(): (score_registry_interface | null)[] | null {
        const player: Player[] | undefined = this.players.filter(Player => Player.AI)

        let ret: (score_registry_interface | null)[] = [];
        if (player.length > 0) {
            ret = player.map((player: Player) => player.tainingData)
        }
        return ret;
    }


    public pushPlayer(player: Player): boolean {
        if (!player) return false;
        if (player && player.currentmatch_id !== -1) {
            app.log.error(`Player ${player.PlayerName} is not valid.`);
            return false;
        }
        if (player && this.players.some(p => p.Player_id === player.Player_id)) {
            app.log.info(`Player ${player.PlayerName} is already in the match.`);
            return false;
        }
        if (player && this.players.length >= 2) {
            app.log.info(`Match ${this.match_id} is already full.`);
            return false;
        }
        this.players.push(player);
        player.match_id = this;
        player.currentmatch_id = this.match_id;
        // if (!player.designatedNextMatch) {
        //     player.designatedNextMatch = [];
        // }
        app.log.info(`Player ${player.PlayerName} has joined match ${this.match_id}.`);
        if (this.players.length === 1) {
            app.log.info(`Match ${this.match_id} waiting for second player.`);
            return true;
        }
        if (this.players.length === 2 && !this.interval) {
            app.log.info(`Match ${this.match_id} has enough players to start monitoring.`);
            this.GameMonitoring();
        }
        return false;
    }

    public GameMonitoring(): void {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        if (this.endedAt !== -1) return;
        this.interval = setInterval(() => {
            this.players = this.players.filter(player => player.Player_id !== -1);

            if (this.PlayerLeft !== -1) {
                this.winner = this.players.find(player => player.Player_id !== this.PlayerLeft);
                // fullPurgePlayers(this.PlayerLeft);
            } else {
                this.winner = this.players.find(player => player.score >= this.scoreGoal);
            }
            if (this.winner) {
                app.log.info(`Match ${this.match_id} has a winner!`);
                clearInterval(this.interval!);
                this.interval = null;
                this.endedAt = Date.now();
                if (this.winner.inTournament) {
                    this.winner.tournamentScore += 1000 + this.winner.score;
                    MatchManager.getInstance().TournamentMatches.push(this);
                    // const sideMatch = indexof Matchmaking.getInstance().TournamentMatches.fin
                    // this.winner.designatedNextMatch = 
                    // Matchmaking.getInstance().TournamentMatches.;
                }
                for (const player of this.players) {

                    player.currentmatch_id = -1;
                    player.score = 0;
                    if (player.Player_id === this.winner?.Player_id) {
                        app.log.info(`Player ${player.PlayerName} won the match!`);
                        player.tournamentScore += 1000 + player.score;
                    } else {
                        app.log.info(`Player ${player.PlayerName} lost the match.`);
                    }
                }
                this.players = [];
                MatchManager.getInstance().matches = MatchManager.getInstance().matches.filter(match => match.match_id !== this.match_id);
                MatchManager.getInstance().TournamentMatches = MatchManager.getInstance().TournamentMatches.filter(match => match.match_id !== this.match_id);
                app.log.info(`Match ${this.match_id} ended at ${new Date(this.endedAt).toLocaleString()}`);
                return;
            }
            if (this.players.length === 0) {
                app.log.info(`Match ${this.match_id} has no players.`);
                return;
            }
            if (this.players.length < 2) {
                app.log.info(`Match ${this.match_id} somehow has only one player.`);
                return;
            }
        }, 1000);
    }
}

export default Match;
