import dotenv from 'dotenv';

dotenv.config();
export let TIME_MULTIPLIER = Number(process.env.TIME_MULTIPLIER);
export let CANVAS_WIDTH = Number(process.env.CANVAS_WIDTH);
export let CANVAS_HEIGHT = Number(process.env.CANVAS_HEIGHT);
export let UPDATE_INTERVAL_MS = Number(process.env.UPDATE_INTERVAL_MS);