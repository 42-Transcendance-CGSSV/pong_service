import schemas from "fluent-json-schema";

const genPlayer = schemas
    .object()
    .prop("PlayerName", schemas.string().required())
    .prop("currentBelong", schemas.number().required())
    .prop("side", schemas.string().required())
    .prop("AI", schemas.boolean())

export default genPlayer;