import {getRandomColor} from '../utils/getRandomColor';
import {env} from '../utils/environment';
import PlayerInterface from '../interfaces/player.interface';
import {normalizePosition} from "../utils/maths";


class Player implements PlayerInterface {
    public AI: boolean = true;
    public PaddlePos: number;
    public moveSpeed: number;
    public readonly PaddleWidth: number;
    public readonly PaddleHeight: number;
    public score: number = 0;
    public currentMatchId: string;
    public readonly side: "right" | "left";
    public readonly PlayerID: string;
    public readonly PlayerName: string;
    public readonly playerColor: string = getRandomColor();
    public ready: boolean = false;

    constructor(PlayerName: string, playerId: string, currentMatchId: string, side: "left" | "right", AI?: boolean) {
        this.currentMatchId = currentMatchId;
        this.PlayerID = playerId;  //TODO: Replace with number
        this.side = side;
        this.PlayerName = PlayerName;
        this.PaddlePos = env.CANVAS_HEIGHT / 2 - env.PLAYER_PADDLE_HEIGHT / 2;
        this.PaddleHeight = env.PLAYER_PADDLE_HEIGHT;
        this.PaddleWidth = env.PADDLE_WIDTH;
        this.moveSpeed = env.PLAYER_MOVE_SPEED * env.TIME_MULTIPLIER;
        this.AI = AI ?? true;
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
        return this.PlayerID;
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
        return {...this, relativeY: normalizePosition(this.PaddlePos, env.CANVAS_HEIGHT, 0)};
    }

}

export default Player;