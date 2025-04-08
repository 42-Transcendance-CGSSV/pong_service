import schemas from "fluent-json-schema";


const ballInfo = schemas
    .object()
    .prop("ballID", schemas.number().required())
    .prop("ballX", schemas.number().required())
    .prop("ballY", schemas.number().required())
    .prop("ballVelocityX", schemas.number().required())
    .prop("ballVelocityY", schemas.number().required())


export default ballInfo;
    // public ballX: number;
    // public ballY: number;
    // public ballVelocityX: number;
    // public ballVelocityY: number;
    // public readonly canvasWidth: number;
    // public readonly canvasHeight: number;
    // public readonly ballRadius: number;




