import schemas from "fluent-json-schema";

// const playerSchema = schemas.object()
//     .prop("player_name", schemas.string().minLength(3).maxLength(16).pattern("^[A-Za-z]+$").required())
//     .prop("user_id", schemas.number().required()) //TODO: Replace with number`
//     .prop("is_ai", schemas.boolean().required())
//     .prop("isTraining", schemas.boolean().required())
    // .additionalProperties(false);

const initPlayerSchemas = schemas.object()
    .prop("player_name", schemas.string().minLength(4).maxLength(16).pattern("^[A-Za-z]+$").required())
    .prop("user_id", schemas.number().minimum(1).required())
    .prop("is_ai", schemas.boolean().required())
    .prop("isTraining", schemas.boolean().required())

export default initPlayerSchemas;