"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fluent_json_schema_1 = __importDefault(require("fluent-json-schema"));
const ballInfo = fluent_json_schema_1.default
    .object()
    .prop("ballID", fluent_json_schema_1.default.number().required())
    .prop("ballX", fluent_json_schema_1.default.number().required())
    .prop("ballY", fluent_json_schema_1.default.number().required())
    .prop("ballVelocityX", fluent_json_schema_1.default.number().required())
    .prop("ballVelocityY", fluent_json_schema_1.default.number().required());
exports.default = ballInfo;
// public ballX: number;
// public ballY: number;
// public ballVelocityX: number;
// public ballVelocityY: number;
// public readonly canvasWidth: number;
// public readonly canvasHeight: number;
// public readonly ballRadius: number;
