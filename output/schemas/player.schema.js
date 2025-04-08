"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fluent_json_schema_1 = __importDefault(require("fluent-json-schema"));
const playerInfo = fluent_json_schema_1.default
    .object()
    .prop("playerID", fluent_json_schema_1.default.string().required());
exports.default = playerInfo;
// const playerInfo = schemas
//     .object()
//     .prop("playerID", schemas.string().required())
//     .prop("playerName", schemas.string().required())
//     .prop("PaddleHeight", schemas.number().required())
//     .prop("PaddleWidth", schemas.number().required())
//     .prop("canvasHeight", schemas.number().required())
//     .prop("moveSpeed", schemas.number().required())
//     .prop("side", schemas.string().required())
//     .prop("AI", schemas.boolean().required());
// export default playerInfo;
