import fastifyStatic from '@fastify/static';
import path from 'path';


import fastify from "fastify";
import dotenv from "dotenv";

// import items from "./items";
import {pongController} from "./controllers/controllerPong"; 
import swaggerUI from "@fastify/swagger-ui";
import swagger from "@fastify/swagger";

const app = fastify({ logger: true,ajv: { customOptions: { removeAdditional: "all" } } });
app.register(pongController);


app.register(swagger, {
    swagger: {
        info: {
            title: "Pong API",
            description: "API Documentation for Pong",
            version: "0.1.0",
        },


    }
});
app.register(swaggerUI, {
    routePrefix: "/doc",
    uiConfig: {
        docExpansion: 'full',
        deepLinking: false,
      }
});


app.register(fastifyStatic, {
    root: path.join(__dirname, '../public'),
    prefix: '/', // so it serves at http://localhost:3000/
  });


  
dotenv.config();


















//TODO: FIXING ENV UNDEFINED
async function start(): Promise<void> {
    try {
        await app.listen({ port: Number(process.env.PORT ) });
    } catch (error) {
        app.log.error(error);
        process.exit(1);
    }
}

app.get(process.env.BASE_ROUTE + "/healthcheck", (_req, response) => {
        response.send({ message: "Success" });
});

start();
