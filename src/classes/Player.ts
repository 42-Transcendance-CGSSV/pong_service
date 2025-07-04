import {getRandomColor} from '../utils/getRandomColor';
import {env} from '../utils/environment';
import PlayerInterface from '../interfaces/player.interface';
import {normalizePosition} from "../utils/maths";
import {ScoreRegistryInterface} from "../interfaces/score.registry.interface";
import Match from './Match';
import {app} from "../app";


class Player implements PlayerInterface {
    public readonly AI: boolean = true;
    public readonly isTraining: boolean = false;
    public tainingData: ScoreRegistryInterface | null = null;
    public PaddlePos: number;
    public moveSpeed: number;
    public readonly PaddleWidth: number;
    public readonly PaddleHeight: number;
    public score: number = 0;
    public currentMatchId: number = -1;
    public side: number = 0;
    public readonly playerId: number;
    public readonly playerName: string;
    public readonly playerColor: string = getRandomColor();
    public ready: boolean = false;
    public match: Match | null = null;

    constructor(PlayerName: string, playerId: number, AI: boolean, isTraining: boolean) {
        this.playerId = playerId;
        this.playerName = PlayerName;
        this.PaddleHeight = 0.1 * env.CANVAS_HEIGHT;
        this.PaddlePos = env.CANVAS_HEIGHT / 2 //- this.PaddleHeight / 2;
        this.PaddleWidth = env.PADDLE_WIDTH / 110;
        this.moveSpeed = 0.0069 * env.CANVAS_WIDTH;
        this.AI = AI;
        this.isTraining = isTraining;
        if (env.TIME_MULTIPLIER !== 1)
            app.log.warn("Player: WARNING TIME MULTIPLIER SET TO ", env.TIME_MULTIPLIER)
    }

    public moveUp() {
        if (this.PaddlePos > 0)
            this.PaddlePos -= this.moveSpeed;
    };

    public moveDown() {
        if (this.PaddlePos < env.CANVAS_HEIGHT - this.PaddleHeight)
            this.PaddlePos += this.moveSpeed;
    }

    public getSide() {
        return this.side;
    }

    public getID() {
        return this.playerId ? this.playerId : -1;
    }

    public getPos() {
        return this.PaddlePos;
    }

    public getPaddleHeight() {
        return this.PaddleHeight;
    }

    public getPaddleWidth() {
        return this.PaddleWidth;
    }

    public ExportPlayerInfo() {
        return {...this, relativeY: normalizePosition(this.PaddlePos + this.PaddleHeight / 2, env.CANVAS_HEIGHT, 0)};
    }

    public ExportRenderInfo() {
        return {
            Player_id: this.getID(),
            relativeY: normalizePosition(this.PaddlePos + this.PaddleHeight / 2, env.CANVAS_HEIGHT, 0),
            side: this.getSide(),
            isTraining: this.isTraining
        }
    }


}

export default Player;