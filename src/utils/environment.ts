import dotenv from "dotenv";

dotenv.config();

export const env = {
    ENVIRONMENT: process.env.ENVIRONMENT || "DEVELOPMENT",
    LOG_LEVEL: process.env.LOG_LEVEL || "debug",
    LOG_TIME_FORMAT: process.env.LOG_TIME_FORMAT || "${day}:${month}:${year} ${hours}:${minutes} (${seconds}:${milliseconds})",
    PORT: (process.env.PORT as unknown as number) ? parseInt(process.env.PORT as string, 10) : 3000,

    TIME_MULTIPLIER: Number(process.env.TIME_MULTIPLIER) || 1,
    PADDLE_WIDTH: Number(process.env.PADDLE_WITH) || 10,
    PADDLE_HEIGHT: Number(process.env.PADDLE_HEIGHT) || 80,
    CANVAS_WIDTH: Number(process.env.CANVAS_WIDTH) || 800,
    CANVAS_HEIGHT: Number(process.env.CANVAS_HEIGHT) || 600,
    UPDATE_INTERVAL_MS: Number(process.env.UPDATE_INTERVAL_MS) || 16,

    PLAYER_MOVE_SPEED: Number(process.env.PLAYER_MOVE_SPEED) || 12,
    PLAYER_PADDLE_HEIGHT: Number(process.env.PLAYER_PADDLE_HEIGHT) || 80,
    PLAYER_PADDLE_WIDTH: Number(process.env.PLAYER_PADDLE_WIDTH) || 10,
};

