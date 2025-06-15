import matchInterface from "../interfaces/match.interface";
import Ball from "./Ball";
import Player from "./Player";
import {env} from "../utils/environment";
import MatchExportInterface from "../interfaces/match.export.interface";

export interface AiNeeds {
    playerID: number ,
    myScore: number,
    ballX: number,
    ballY: number,
    ballSpeedX: number,
    ballSpeedY: number,
    myPosition: number,
    mySide: number,
    isTraining: boolean
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


    public constructor(scoreGoal: number, match_id: number) {
        this.match_id = match_id;
        this.ball = new Ball(10, 3, 3);
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
                console.log(`Player ${player.PlayerName} won the match!`);
                this.resetMatch();
                return;
            }
        }
    }

    public addPlayer(Player: Player): void {
        this.players.length === 1 ? Player.side = "right" : Player.side = "left";
        Player.currentmatch_id = this.match_id;
        this.players.push(Player);
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
    public exportRenderInfo()
    {
        return {
            ball: { relativeBallX: this.ball.ExportBallInfo().relativeBallX , relativeBallY: this.ball.ExportBallInfo().relativeBallY},
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

    public exportAiNeeds() : AiNeeds[] | null{
        const player:Player[]|undefined = this.players.filter(Player => Player.AI === true)

        let ret : AiNeeds[] | null = null;
        if (player.length > 0)
        {
            ret = player.map ((player: Player) => ({
                playerID:  player.Player_id,
                myScore: player.score,
                ballX: this.ball.ExportBallInfo().relativeBallX,
                ballY: this.ball.ExportBallInfo().relativeBallY,
                ballSpeedX: this.ball.ExportBallInfo().ballSpeedX,
                ballSpeedY: this.ball.ExportBallInfo().ballSpeedY,
                myPosition: player.ExportRenderInfo().relativeY,
                mySide: player.side === "left"?0:1,
                isTraining: player.isTraining
            }))
        }

        // if (player === undefined)
        // console.log ("export ai needs :", ret)
        return ret;
        // return({
        //     playerID:  player.Player_id,
        //     myScore: player.score,
        //     ballX: this.ball.ExportBallInfo().relativeBallX,
        //     ballY: this.ball.ExportBallInfo().relativeBallY,
        //     ballSpeedY: 3,
        //     myPosition: player.ExportRenderInfo().relativeY,
        //     PaddleHeight: 80,
        //     mySide: player.side === "left"?0:1
        // })
    }
}

export default Match;
