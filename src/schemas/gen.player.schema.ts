import schemas from "fluent-json-schema";

const playerSchema = schemas.object()
    .prop("player_name", schemas.string().minLength(4).maxLength(16).pattern("^[A-Za-z]+$").required())
    .prop("user_id", schemas.string().required()) //TODO: Replace with number`
    .prop("is_ai", schemas.boolean().required())
    .additionalProperties(false);

const initPlayersSchemas = schemas
    .object()
    .definition("player_1", playerSchema)
    .definition("player_2", playerSchema)
    .prop("match_id", schemas.string().required())//TODO: Replace with number

export default initPlayersSchemas;