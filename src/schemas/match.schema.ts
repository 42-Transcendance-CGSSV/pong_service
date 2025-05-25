import schemas from "fluent-json-schema";

const MatchInfo = schemas
    .object()
    .prop("MatchID", schemas.number().required())

export default MatchInfo;






// const MatchInfo = schemas
//     .object()
//     .prop("MatchID", schemas.number().required())
//     .prop("ball", schemas.object().required())
//     .prop("player1", schemas.object().required())
//     .prop("player2", schemas.object().required())
//     .prop("scorePlayer1", schemas.number().required())
//     .prop("scorePlayer2", schemas.number().required())
//     .prop("scoreGoal", schemas.number().required())
//     .prop("startedAt", schemas.number().required())
//     .prop("endedAt", schemas.number().required())
//     .prop("winnerId", schemas.number().required());


// export default MatchInfo;




// public readonly ball: Ball;
// public readonly player1: PlayerInterface;
// public readonly player2: PlayerInterface;
// public scorePlayer1: number;
// public scorePlayer2: number;
// public readonly scoreGoal: number;
// public readonly startedAt: number;
// public endedAt: number;
// public winnerId: number;