import MatchInterface from "../interfaces/matchInterface";
import Ball from "./Ball";
import Player from "./Player";
import {ScoreRegistryInterface} from "../interfaces/score.registry.interface";
import {app} from "../app";
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
	public isRunning: boolean = false;
	public readonly matchId: number;
	public readonly ball: Ball;
	public players: Player[] = [];
	public readonly scoreGoal: number;
	public startedAt: number = -1;
	public pausedAt: number = -1;
	public endedAt: number = -1;
	public winnerId: number = -1;

	public interval: NodeJS.Timeout | null = null;

	public constructor(scoreGoal: number) {
		this.matchId = ++MatchManager.getInstance().matchCounter;
		this.scoreGoal = scoreGoal;
		this.ball = new Ball();
		this.isRunning = false;
		this.startedAt = -1;
	}


	public checkForWinner(): void {
		for (const player of this.players) {
			if (player.score >= this.scoreGoal) {
				this.isRunning = false;
				this.endedAt = Date.now();
				this.winnerId = player.playerId;
				app.log.info(`Player ${player.playerId} won the match!`);
				endMatch(this);
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
		const players: Player[] = [];
		for (const player of this.players) {
			const socket = WebsocketsManager.getInstance().getSocketFromUserId(player.playerId);
			if (socket && (socket.isPaused || socket.readyState !== socket.OPEN))
				continue;
			players.push(player);
		}
		return players;
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
				isTraining: player.isTraining,
				mySide: player.side
			}))
		}
		return ret;
	}

	public exportRegistry(): (ScoreRegistryInterface | null)[] | null {
		const player: Player[] | undefined = this.players.filter(Player => Player.AI)

		let ret: (ScoreRegistryInterface | null)[] = [];
		if (player.length > 0) {
			ret = player.map((player: Player) => player.trainingData)
		}
		return ret;
	}


	public pushPlayer(player: Player): boolean {
		if (!player) return false;
		if (player && player.currentMatchId !== -1) {
			app.log.error(`Player ${player.playerId} is not valid.`);
			return false;
		}
		if (player && this.players.some(p => p.playerId === player.playerId)) {
			app.log.info(`Player ${player.playerId} is already in the match.`);
			return false;
		}
		if (player && this.players.length >= 2) {
			app.log.info(`Match ${this.matchId} is already full.`);
			return false;
		}
		this.players.push(player);
		player.match = this;
		player.currentMatchId = this.matchId;
		// if (!player.designatedNextMatch) {
		//     player.designatedNextMatch = [];
		// }
		app.log.info(`Player ${player.playerId} has joined match ${this.matchId}.`);
		if (this.players.length === 1) {
			app.log.info(`Match ${this.matchId} waiting for second player.`);
			return true;
		}
		if (this.players.length === 2 && !this.interval) {
			app.log.info(`Match ${this.matchId} has enough players to start monitoring.`);
		}
		return false;
	}
}

export default Match;
