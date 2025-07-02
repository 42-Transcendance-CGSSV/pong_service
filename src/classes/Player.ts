import {getRandomColor} from '../utils/getRandomColor';
import {env} from '../utils/environment';
import PlayerInterface from '../interfaces/player.interface';
import {normalizePosition} from "../utils/maths";
import {score_registry_interface} from "../interfaces/score.registry.interface";
import Match from './Match';
import {app} from "../app";


class Player implements PlayerInterface {
    public readonly AI: boolean = true;
    public readonly isTraining: boolean = false;
    public tainingData: score_registry_interface | null = null;
    public PaddlePos: number;
    public moveSpeed: number;
    public readonly PaddleWidth: number;
    public readonly PaddleHeight: number;
    public score: number = 0;
    public currentmatch_id: number = -1;
    public side: number = 0;
    public readonly Player_id: number;
    public readonly PlayerName: string;
    public readonly playerColor: string = getRandomColor();
    public ready: boolean = false;
    public match_id: Match | null = null;


    public inTournament: boolean = true;
    public designatedNextMatch: number = -1;
    public tournamentScore: number = 0;


    constructor(PlayerName: string, Player_id: number, AI: boolean, isTraining: boolean) {
        this.Player_id = Player_id;
        this.PlayerName = PlayerName;
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
        return this.Player_id ? this.Player_id : -1;
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