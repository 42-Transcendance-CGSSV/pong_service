"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UPDATE_INTERVAL_MS = exports.CANVAS_HEIGHT = exports.CANVAS_WIDTH = exports.TIME_MULTIPLIER = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.TIME_MULTIPLIER = Number(process.env.TIME_MULTIPLIER);
exports.CANVAS_WIDTH = Number(process.env.CANVAS_WIDTH);
exports.CANVAS_HEIGHT = Number(process.env.CANVAS_HEIGHT);
exports.UPDATE_INTERVAL_MS = Number(process.env.UPDATE_INTERVAL_MS);
