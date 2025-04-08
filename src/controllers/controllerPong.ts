import { getMatchInfo , getPlayerInfo , startGame ,stopGame ,movePlayerUP, movePlayerDown, generateNewPlayer, } from "../utils/sendItems";
import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";


import rateLimit from '@fastify/rate-limit';
import playerInfo from "../schemas/player.schema";
// import MatchInfo from "../schemas/Match.schema";
import genPlayer from "../schemas/gen.player.schema";



export function pongController(fastify: FastifyInstance, _options: any, done: () => void)
{

    fastify.register(rateLimit, {
        max: 30,
        timeWindow: '1 second'
    });


    
    fastify.get(process.env.BASE_ROUTE + "/player/:PlayerID", {
        // schema:{params: playerInfo},
        handler: (request: FastifyRequest, reply: FastifyReply) => {
            getPlayerInfo(request, reply);
        }
        
    });

    fastify.get(process.env.BASE_ROUTE + "/match/:MatchID", {
        // schema:{params: MatchInfo},
        handler: (request: FastifyRequest, reply: FastifyReply) => {
            getMatchInfo(request, reply); 
        }
    })













    fastify.put(process.env.BASE_ROUTE + "/stopGame/:MatchIndex",{
        handler: (request: FastifyRequest, reply: FastifyReply) => {
            stopGame(request, reply);
        }
    });
    fastify.put(process.env.BASE_ROUTE + "/startGame/:MatchIndex", {
        handler: (request: FastifyRequest, reply: FastifyReply) => {
            startGame(request, reply);
        }
    });











    fastify.post(process.env.BASE_ROUTE + "/movePlayerUp/:PlayerID", {
        schema:{body: playerInfo},
        handler: (request: FastifyRequest, reply: FastifyReply) => {
            movePlayerUP(request, reply);
        }
    });
    fastify.post(process.env.BASE_ROUTE + "/movePlayerDown/:PlayerID", {
        schema:{body: playerInfo},
        handler: (request: FastifyRequest, reply: FastifyReply) => {
            movePlayerDown(request, reply);
        }
    });









    
    fastify.put(process.env.BASE_ROUTE + "/generateNewPlayer", {
        schema: {body : genPlayer},
        handler: (request: FastifyRequest, reply: FastifyReply) => {
            generateNewPlayer(request, reply);
        }
    });
    
    done();
}