"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fluent_json_schema_1 = __importDefault(require("fluent-json-schema"));
const generatePlayerSchema = fluent_json_schema_1.default
    .object()
    .prop("playerID", fluent_json_schema_1.default.number().required())
    .prop("playerName", fluent_json_schema_1.default.string().required())
    .prop("PaddleHeight", fluent_json_schema_1.default.number().required())
    .prop("PaddleWidth", fluent_json_schema_1.default.number().required())
    .prop("canvasHeight", fluent_json_schema_1.default.number().required())
    .prop("moveSpeed", fluent_json_schema_1.default.number().required())
    .prop("side", fluent_json_schema_1.default.string().required())
    .prop("AI", fluent_json_schema_1.default.boolean().required());
exports.default = generatePlayerSchema;
