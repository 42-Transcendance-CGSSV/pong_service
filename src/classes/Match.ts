import MatchInterface from "../interfaces/matchInterface";
import Ball from "./Ball";
import Player from "./Player";
import {ScoreRegistryInterface} from "../interfaces/score.registry.interface";
import MatchManager from "../managers/match.manager";
import {endMatch} from "../services/match.service";
import WebsocketsManager from "../managers/websockets.manager";

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

class Match implements MatchInterface {
    public isRunning: boolean;
    public readonly matchId: number;
    public readonly ball: Ball;
    public players: Player[];
    public readonly scoreGoal: number;
    public startedAt: number;
    public pausedAt: number;
    public endedAt: number;
    public winnerId: number;

    public constructor(scoreGoal: number) {
        this.matchId = ++MatchManager.getInstance().matchCounter;
        this.scoreGoal = scoreGoal;
        this.players = [];
        this.ball = new Ball();
        this.isRunning = false;
        this.startedAt = -1;
        this.pausedAt = -1;
        this.endedAt = -1;
        this.winnerId = -1;
    }


    public checkForWinner(): void {
        for (const player of this.players) {
            if (player.score >= this.scoreGoal) {
                this.isRunning = false;
                this.winnerId = player.playerId;
                endMatch(this, this.winnerId);
                return;
            }
        }
    }

    public addPlayer(Player: Player): boolean {
        Player.currentMatchId = this.matchId;
        this.players.push(Player);
        return this.players.includes(Player, 0);
    }

    public getPlayersInMatch(): Player[] {
        return this.players;
    }

    public getOnlinePlayerInMatch(): Player[] {
        return this.players.filter(player => {
            const socket = WebsocketsManager.getInstance().getSocketFromUserId(player.playerId);
            return socket && !socket.isPaused && socket.readyState === socket.OPEN;
        });
    }

    public playerIsInMatch(player: Player): boolean {
        return this.players.includes(player);
    }

    public getPlayerById(Player_id: number): Player | undefined {
        return this.players.find(player => player.playerId === Player_id);
    }

    public isSameBall(ball: Ball): boolean {
        return ball === this.ball;
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

    public exportAiNeeds(): AiNeeds | null {
        const player: Player | undefined = this.players.filter(Player => Player.AI)[0];
        if (!player) return null;

        return {
            playerID: player.playerId,
            myScore: player.score,
            ballX: this.ball.ExportBallInfo().relativeBallX,
            ballY: this.ball.ExportBallInfo().relativeBallY,
            ballSpeedX: this.ball.ExportBallInfo().ballSpeedX,
            ballSpeedY: this.ball.ExportBallInfo().ballSpeedY,
            myPosition: player.ExportRenderInfo().relativeY,
            isTraining: player.isTraining,
            mySide: player.side
        };
    }

    public exportRegistry(): (ScoreRegistryInterface | null)[] | null {
        const player: Player[] | undefined = this.players.filter(Player => Player.AI)

        let ret: (ScoreRegistryInterface | null)[] = [];
        if (player.length > 0) {
            ret = player.map((player: Player) => player.trainingData)
        }
        return ret;
    }
}

export default Match;
