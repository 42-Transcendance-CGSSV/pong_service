import schemas from "fluent-json-schema";

const playerSchema = schemas.object()
    .prop("player_name", schemas.string().minLength(3).maxLength(16).pattern("^[A-Za-z]+$").required())
    .prop("user_id", schemas.number().required()) //TODO: Replace with number`
    .prop("is_ai", schemas.boolean().required())
    // .additionalProperties(false);

const initPlayersSchemas = schemas
    .object()
    .prop("match_id", schemas.number().required())//TODO: Replace with number
    .prop("player_1", playerSchema)
    .prop("player_2", playerSchema)

export default initPlayersSchemas;