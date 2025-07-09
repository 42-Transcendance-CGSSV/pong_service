import {env} from "../utils/environment";
import Player from "./Player";

import BallInterface from "../interfaces/ball.interface";
import MatchManager from "../managers/match.manager";
import {normalizePosition} from "../utils/maths";
import {app} from "../app";

export let TRAINING_MODE = false;
let CURRENT_TRAINING_POS = {
    FPositionX: 3,
    FPositionY: 0,
    FSpeedX: 0.0049 * env.CANVAS_WIDTH,
    FSpeedY: 0,
};

interface trainingDataInterface {
    side: number | null,
    FPositionX: number | null,
    FPositionY: number | null,
    FSpeedX: number | null,
    FSpeedY: number | null,
    answer: number | null,
    Level: number | null,
}

interface defaultValues {
    ballX: number,
    ballY: number,
    ballVelocityX: number,
    ballVelocityY: number,
    ballRadius: number,
}

class SendAllowed {
    // public interval: NodeJS.Timeout | null = null;
    static tainingData: trainingDataInterface;
    public static value: boolean = true;
    static interval: NodeJS.Timeout | null = null;

    public constructor() {
        SendAllowed.reset();
    }

    public static get(): trainingDataInterface | null {
        const TD = this.tainingData;
        // if (TD && TD.FPositionX !== null && TD.FPositionY !== null &&
        //     TD.FSpeedX !== null && TD.FSpeedY !== null &&
        //     TD.answer !== null && TD.Level !== null) {
        this.reset();
        return TD;
        // }
        return null;
    }

    public static setInfo(side: number, FPositionX: number, FPositionY: number, FSpeedX: number, FSpeedY: number): void {
        if (!this.tainingData)
            this.reset();
        if (this.tainingData.side || this.tainingData.FPositionX ||
            this.tainingData.FPositionY || this.tainingData.FSpeedX ||
            this.tainingData.FSpeedY) return;
        else if (this.tainingData.answer || this.tainingData.Level) this.reset();
        else {
            this.tainingData.side = side;
            this.tainingData.FPositionX = FPositionX;
            this.tainingData.FPositionY = FPositionY;
            this.tainingData.FSpeedX = FSpeedX;
            this.tainingData.FSpeedY = FSpeedY;
        }
    }

    public static setAnswer(answer: number, level: number): void {
        if (!this.tainingData)
            this.reset();
        if (this.tainingData.answer || this.tainingData.Level) return;
        this.tainingData.answer = answer;
        this.tainingData.Level = level;
    }

    static reset(): void {
        this.tainingData = {
            side: null,
            FPositionX: null,
            FPositionY: null,
            FSpeedX: null,
            FSpeedY: null,
            answer: null,
            Level: null,
        };
    }
}

class Ball implements BallInterface {
    public ballX: number;
    public ballY: number;
    public ballVelocityX: number;
    public ballVelocityY: number;
    public ballRadius: number;
    public lastToHit                ?: Player;
    private readonly defaultValues: defaultValues = {
        ballX: env.CANVAS_WIDTH / 2,
        ballY: env.CANVAS_HEIGHT / 2,
        ballVelocityX: 0.0049 * env.CANVAS_WIDTH,
        ballVelocityY: 0.0049 * env.CANVAS_WIDTH,
        ballRadius: env.CANVAS_WIDTH / 100,
    };

    constructor() {
        if (TRAINING_MODE) {
            this.ballX = CURRENT_TRAINING_POS.FPositionX;
            this.ballY = CURRENT_TRAINING_POS.FPositionY;
            this.ballVelocityX = CURRENT_TRAINING_POS.FSpeedX;
            this.ballVelocityY = CURRENT_TRAINING_POS.FSpeedY;
            this.ballRadius = this.defaultValues.ballRadius;
        } else {
            this.ballX = this.defaultValues.ballX;
            this.ballY = this.defaultValues.ballY;
            this.ballRadius = this.defaultValues.ballRadius;
            this.ballVelocityX = this.defaultValues.ballVelocityX;
            this.ballVelocityY = this.defaultValues.ballVelocityY;
        }
        if (env.TIME_MULTIPLIER !== 1)
            app.log.warn("Ball: WARNING TIME MULTIPLIER SET TO ", env.TIME_MULTIPLIER)
    }

    public normalizePosition(position: number, max: number, min: number): number {
        return (position - min) / (max - min);
    }

    public moveBall(): void {
        this.ballX += this.ballVelocityX * env.TIME_MULTIPLIER;
        this.ballY += this.ballVelocityY * env.TIME_MULTIPLIER;
        // console.log("moving Ball position: ", this.ballX, this.ballY, "Ball speed: ", this.ballVelocityX, this.ballVelocityY);

        this.backIntime();
        if (this.ballY - this.ballRadius <= 0 || this.ballY + this.ballRadius >= env.CANVAS_HEIGHT) {
            this.ballVelocityY = -this.ballVelocityY;
        }
        this.checkCollision();
    }

    resetBall(): void {
        this.ballX = this.defaultValues.ballX;
        this.ballY = this.defaultValues.ballY;
        this.ballVelocityX = this.defaultValues.ballVelocityX;
        this.ballVelocityY = this.defaultValues.ballVelocityY;
        this.ballVelocityX = Math.random() > 0.5 ? this.ballVelocityX : -this.ballVelocityX;
        this.ballVelocityY = Math.random() * this.ballVelocityY + 0.01;
        this.lastToHit = undefined;
    }

    public backIntime(): void {
        // if (1) return
        let distanceBack: number = 0;
        if (this.ballX < 0) {
            distanceBack = Math.abs(this.ballX) / Math.abs(this.ballVelocityX);
            this.ballX = 0;
            if (this.ballVelocityY !== 0) {
                this.ballY -= this.ballVelocityY * distanceBack;
            }
        } else if (this.ballX > env.CANVAS_WIDTH) {
            distanceBack = Math.abs(this.ballX - env.CANVAS_WIDTH) / Math.abs(this.ballVelocityX);
            this.ballX = env.CANVAS_WIDTH;
            if (this.ballVelocityY !== 0) {
                this.ballY -= this.ballVelocityY * distanceBack;
            }
        } else if (this.ballY - this.ballRadius < 0) {
            distanceBack = Math.abs(this.ballY - this.ballRadius) / Math.abs(this.ballVelocityY);
            this.ballY = this.ballRadius;
            this.ballX -= this.ballVelocityX * distanceBack;
        } else if (this.ballY + this.ballRadius > env.CANVAS_HEIGHT) {
            distanceBack = Math.abs(this.ballY + this.ballRadius - env.CANVAS_HEIGHT) / Math.abs(this.ballVelocityY);
            this.ballY = env.CANVAS_HEIGHT - this.ballRadius;
            this.ballX -= this.ballVelocityX * distanceBack;
        }
    }

    public checkCollision(): void {
        this.backIntime();
        if (this.ballX <= 0 || this.ballX >= env.CANVAS_WIDTH) {
            if (this.ballX >= env.CANVAS_WIDTH) {
                SendAllowed.setAnswer(this.ballY, 0);
            }
            // console.log("Ball position: ", this.ballX, this.ballY, "Ball speed: ", this.ballVelocityX, this.ballVelocityY);
            // this.updateScoreRegistery(this.ballX < 0 ? 0 : 1);


            if (this.lastToHit) {
                this.lastToHit.score++;
                app.log.debug(`player ${this.lastToHit.playerId} scored :${this.lastToHit.score}`);
                this.lastToHit = undefined;
            }
            if (TRAINING_MODE) {
                this.ballVelocityX = -this.ballVelocityX;
                if (CURRENT_TRAINING_POS.FPositionX > env.CANVAS_WIDTH - 0.1 * env.CANVAS_WIDTH) {
                    CURRENT_TRAINING_POS.FPositionX = 3;
                }
                if (CURRENT_TRAINING_POS.FPositionY > env.CANVAS_HEIGHT - 0.1 * env.CANVAS_HEIGHT) {
                    CURRENT_TRAINING_POS.FPositionY = 0;
                    CURRENT_TRAINING_POS.FPositionX += 0.5;
                }
                // if ()
                this.ballX = CURRENT_TRAINING_POS.FPositionX;
                this.ballY = CURRENT_TRAINING_POS.FPositionY;
                this.ballVelocityX = CURRENT_TRAINING_POS.FSpeedX;
                this.ballVelocityY = CURRENT_TRAINING_POS.FSpeedY;
                SendAllowed.setInfo(
                    this.ballX < 0 ? 0 : 1,
                    this.ballX,
                    this.ballY,
                    this.ballVelocityX,
                    this.ballVelocityY,
                );
                this.ballY = CURRENT_TRAINING_POS.FPositionY += 20;
                // this.ballVelocityY = Math.floor(Math.random() * 4 + 1);
            } else {
                this.ballX = this.defaultValues.ballX;
                this.ballY = this.defaultValues.ballY;

                this.ballVelocityX = Math.random() > 0.5 ? this.ballVelocityX : -this.ballVelocityX;
                this.ballVelocityY = Math.random() * this.ballVelocityY + 0.005;
            }
            return;
        }
        // if (1) return;
        const playersInGame = MatchManager.getInstance().getPlayersByBall(this);
        if (!playersInGame) {
            return;
        }

        for (const player of playersInGame) {
            if (!player) {
                continue;
            }
            const nextBallVelocityY = Math.random() * this.ballVelocityY + 0.01;
            if (0)//player.getSide() === 0)//TRAINING_MODE)
            {
                if (this.ballY < player.getPos())
                    player.moveUp();
                else if (this.ballY > player.getPos() + player.getPaddleHeight())
                    player.moveDown();
            }

            if (player !== this.lastToHit &&
                player.getSide() === 0 &&
                this.ballX - this.ballRadius < player.getPaddleWidth() &&
                this.ballY > player.getPos() &&
                this.ballY < player.getPos() + player.getPaddleHeight()) {
                // this.ballVelocityX = this.raiseBallSpeed(this.ballVelocityX, "-") ;Math.floor(Math.random() * this.ballVelocityY + 0.01)
                this.ballVelocityX = -this.ballVelocityX;
                // this.ballVelocityY = this.raiseBallSpeed(this.ballVelocityY, "+") ;
                this.ballVelocityY = Math.random() > 0.5 ? this.ballVelocityY + nextBallVelocityY : -this.ballVelocityY + nextBallVelocityY;
                this.lastToHit = player;
                // console.log("left",this.ballVelocityX, this.ballVelocityY);
                break;
            }
            if (player !== this.lastToHit &&
                player.getSide() === 1 &&
                this.ballX + this.ballRadius > env.CANVAS_WIDTH - player.getPaddleWidth() &&
                this.ballY > player.getPos() &&
                this.ballY < player.getPos() + player.getPaddleHeight()) {
                // SendAllowed.setAnswer(this.ballY, 0);

                // console.log("right A ",this.ballVelocityX, this.ballVelocityY);
                this.ballVelocityX = -this.ballVelocityX;
                // this.raiseBallSpeed(this.ballVelocityY, "+") ;
                this.ballVelocityY = Math.random() > 0.5 ? this.ballVelocityY + nextBallVelocityY : -this.ballVelocityY + nextBallVelocityY;
                // this.ballVelocityY = this.ballVelocityY > 0 ? this.ballVelocityY : -this.ballVelocityY;
                this.lastToHit = player;
                // console.log("right ",this.ballVelocityX, this.ballVelocityY);
                break;
            }
        }
    }

    // public updateScoreRegistery(side :number): void {
    //     const playersInGame = MatchManager.getInstance().getPlayersByBall(this);
    //     if (!playersInGame) {
    //         return ;
    //     }
    //     if (playersInGame.length !== 2) {
    //         console.log("Ball.getPlayer: playersInGame length is not 2, it is ", playersInGame.length);
    //         return ;
    //     }
    //     for (const player of playersInGame) {
    //         if (!player) {
    //             continue;
    //         }
    //         player.tainingData = {
    //             side: side,
    //             withPositionX: player.getPos(),
    //             ballPositionY: this.ballY,
    //             ballSpeedX: this.ballVelocityX,
    //             ballSpeedY: this.ballVelocityY,
    //             answer: this.ballY,
    //             Level: Date.now(),
    //         };
    //     }
    // }


    public ExportBallInfo() {
        return {
            ballRadius: this.ballRadius,
            relativeBallX: normalizePosition(this.ballX, env.CANVAS_WIDTH, 0),
            relativeBallY: normalizePosition(this.ballY, env.CANVAS_HEIGHT, 0),
            ballSpeedY: this.ballVelocityY,
            ballSpeedX: this.ballVelocityX,
        };
    }
}

export {SendAllowed};

export default Ball;