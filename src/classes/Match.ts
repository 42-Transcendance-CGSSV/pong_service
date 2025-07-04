import matchInterface from "../interfaces/match.interface";
import Ball from "./Ball";
import Player from "./Player";
import {env} from "../utils/environment";
import MatchExportInterface from "../interfaces/match.export.interface";
import {ScoreRegistryInterface} from "../interfaces/score.registry.interface";
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

    public constructor(scoreGoal: number, match_id: number) {
        this.match_id = match_id;
        this.ball = new Ball();
        this.scoreGoal = scoreGoal;
        this.startedAt = -1;
        this.endedAt = -1;
        this.winner_id = -1;

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
                this.winner_id = player.playerId;
                app.log.info(`Player ${player.playerName} won the match!`);
                this.resetMatch();
                return;
            }
        }
    }

    public addPlayer(Player: Player): boolean {
        Player.currentMatchId = this.match_id;
        const check = this.players.length;
        return this.players.push(Player) === check + 1;
    }

    public getPlayersInMatch(): Player[] {
        return this.players;
    }

    public playerIsInMatch(player: Player): boolean {
        return this.players.includes(player);
    }

    public getPlayerById(Player_id: number): Player | undefined {
        return this.players.find(player => player.playerId === Player_id);
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
                playerID: player.playerId,
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

    public exportRegistry(): (ScoreRegistryInterface | null)[] | null {
        const player: Player[] | undefined = this.players.filter(Player => Player.AI)

        let ret: (ScoreRegistryInterface | null)[] = [];
        if (player.length > 0) {
            ret = player.map((player: Player) => player.tainingData)
        }
        return ret;
    }


    public pushPlayer(player: Player): boolean {
        if (!player) return false;
        if (player && player.currentMatchId !== -1) {
            app.log.error(`Player ${player.playerName} is not valid.`);
            return false;
        }
        if (player && this.players.some(p => p.playerId === player.playerId)) {
            app.log.info(`Player ${player.playerName} is already in the match.`);
            return false;
        }
        if (player && this.players.length >= 2) {
            app.log.info(`Match ${this.match_id} is already full.`);
            return false;
        }
        this.players.push(player);
        player.match = this;
        player.currentMatchId = this.match_id;
        // if (!player.designatedNextMatch) {
        //     player.designatedNextMatch = [];
        // }
        app.log.info(`Player ${player.playerName} has joined match ${this.match_id}.`);
        if (this.players.length === 1) {
            app.log.info(`Match ${this.match_id} waiting for second player.`);
            return true;
        }
        if (this.players.length === 2 && !this.interval) {
            app.log.info(`Match ${this.match_id} has enough players to start monitoring.`);
        }
        return false;
    }
}

export default Match;
