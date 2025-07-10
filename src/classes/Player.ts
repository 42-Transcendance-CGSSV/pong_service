import {env} from '../utils/environment';
import PlayerInterface from '../interfaces/player.interface';
import {normalizePosition} from "../utils/maths";
import {ScoreRegistryInterface} from "../interfaces/score.registry.interface";
import {app} from "../app";

class Player implements PlayerInterface {
	public readonly AI: boolean = true;
	public readonly isTraining: boolean = false;
	public trainingData: ScoreRegistryInterface | null = null;
	public paddlePos: number;
	public readonly PaddleWidth: number;
	public readonly PaddleHeight: number;
	public side: number;
	public score: number;
	public currentMatchId;
	public readonly playerId: number;
	public ready: boolean;
	public battedBalls: number;


	public constructor(playerId: number, AI: boolean, isTraining: boolean, side:number) {
		this.side = side;
		this.playerId = playerId;
		this.PaddleHeight = 0.1 * env.CANVAS_HEIGHT;
		this.paddlePos = env.CANVAS_HEIGHT / 2 //- this.PaddleHeight / 2;
		this.PaddleWidth = env.PADDLE_WIDTH / 110;
		this.AI = AI;
		this.isTraining = isTraining;
		this.ready = false;
		this.battedBalls = 0;
		this.currentMatchId = -1;
		this.score = 0;
		if (env.TIME_MULTIPLIER !== 1)
			app.log.warn("Player: WARNING TIME MULTIPLIER SET TO ", env.TIME_MULTIPLIER)
	}

	public moveUp() {

		if (this.paddlePos > 0)
			this.paddlePos -= this.getMoveSpeed();
	};

	public moveDown() {
		if (this.paddlePos < env.CANVAS_HEIGHT - this.PaddleHeight)
			this.paddlePos += this.getMoveSpeed();
	}

	public getID() {
		return this.playerId ? this.playerId : -1;
	}

	public getPos() {
		return this.paddlePos;
	}

	public getPaddleHeight() {
		return this.PaddleHeight;
	}

	public getPaddleWidth() {
		return this.PaddleWidth;
	}

	public getSide() {
		return this.side;
	}



	public ExportPlayerInfo() {
		return {...this, relativeY: normalizePosition(this.paddlePos + this.PaddleHeight / 2, env.CANVAS_HEIGHT, 0)};
	}

	public ExportRenderInfo() {
		return {
			playerId: this.getID(),
			relativeY: normalizePosition(this.paddlePos + this.PaddleHeight / 2, env.CANVAS_HEIGHT, 0),
			isTraining: this.isTraining,
			side: this.side,
		}
	}

	private getMoveSpeed(): number {
		return 0.0069 * env.CANVAS_WIDTH;
	}


}

export default Player;