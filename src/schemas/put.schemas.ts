import schemas from "fluent-json-schema";

export const generatePlayerSchema = schemas
    .object()
    .prop("playerID", schemas.number().required())
    .prop("playerName", schemas.string().required())
    .prop("PaddleHeight", schemas.number().required())
    .prop("PaddleWidth", schemas.number().required())
    .prop("canvasHeight", schemas.number().required())
    .prop("moveSpeed", schemas.number().required())
    .prop("side", schemas.string().required())
    .prop("AI", schemas.boolean().required());
