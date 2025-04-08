"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fluent_json_schema_1 = __importDefault(require("fluent-json-schema"));
const genPlayer = fluent_json_schema_1.default
    .object()
    .prop("PlayerName", fluent_json_schema_1.default.string().required())
    .prop("currentBelong", fluent_json_schema_1.default.number().required())
    .prop("side", fluent_json_schema_1.default.string().required())
    .prop("AI", fluent_json_schema_1.default.boolean());
exports.default = genPlayer;
