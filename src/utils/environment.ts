import dotenv from "dotenv";

dotenv.config();

const allowedLogLevels = ["debug", "info", "warn", "error"];
const logLevel = allowedLogLevels.includes(process.env.LOG_LEVEL || "") ? process.env.LOG_LEVEL : "debug";

export const env = {
    ENVIRONMENT: process.env.ENVIRONMENT || "DEVELOPMENT",
    LOG_LEVEL: logLevel,
    LOG_TIME_FORMAT: "${day}:${month}:${year} ${hours}:${minutes} (${seconds}:${milliseconds})",

    TIME_MULTIPLIER: Number(process.env.TIME_MULTIPLIER) || 1,
    PADDLE_WIDTH: 10,
    PADDLE_HEIGHT: 80,
    CANVAS_WIDTH: 13.33,
    CANVAS_HEIGHT: 10,
    UPDATE_INTERVAL_MS: 16,

    PLAYER_MOVE_SPEED: Number(process.env.PLAYER_MOVE_SPEED) || 12,
    PLAYER_PADDLE_HEIGHT: Number(process.env.PLAYER_PADDLE_HEIGHT) || 80,
    PLAYER_PADDLE_WIDTH: Number(process.env.PLAYER_PADDLE_WIDTH) || 10,

    BACKEND_TOKEN: process.env.BACKEND_TOKEN || "default_token",
};

