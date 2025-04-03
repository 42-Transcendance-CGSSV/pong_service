import fastifyStatic from "@fastify/static";
import path from "path";
import { env } from "./utils/environment";

import fastify from "fastify";
import dotenv from "dotenv";

// import items from "./items";
import { pongController } from "./controllers/controllerPong";
import { ApiError } from "./utils/errors.util";
import { IErrorResponse } from "./interfaces/response.interface";

dotenv.config();
const app = fastify({
    logger: {
        transport: {
            target: "pino-pretty",
            options: {
                colorize: true
            }
        },
        enabled: true,
        level: env.LOG_LEVEL,
        timestamp: () => {
            const now = new Date();
            const day = String(now.getDate()).padStart(2, "0");
            const month = String(now.getMonth() + 1).padStart(2, "0");
            const year = String(now.getFullYear()).slice(-2);
            const hours = String(now.getHours()).padStart(2, "0");
            const minutes = String(now.getMinutes()).padStart(2, "0");
            const seconds = String(now.getSeconds()).padStart(2, "0");
            const milliseconds = String(now.getMilliseconds());
            const logTime = env.LOG_TIME_FORMAT.replace("${day}", day)
                .replace("${month}", month)
                .replace("${year}", year)
                .replace("${hours}", hours)
                .replace("${minutes}", minutes)
                .replace("${seconds}", seconds)
                .replace("${milliseconds}", milliseconds);
            return `,"time":"${logTime}"`;
        }
    },
    disableRequestLogging: true
});

const listeners: string[] = ["SIGINT", "SIGTERM"];
listeners.forEach((signal): void => {
    process.on(signal, async () => {
        console.log("");
        app.log.info(`Received ${signal}. Closing server...`);
        await app.close();
        app.log.info("Server closed !");
        //TODO: CLOSE SERVICES AND OTHERS
        app.log.info("Exiting process...");
        process.exit(0);
    });
});

async function start(): Promise<void> {
    app.setErrorHandler((error, _request, reply) => {
        if (error.name === "ApiError") {
            reply.code((error as ApiError).getHttpStatusCode()).send({
                success: false,
                errorCode: error.code,
                message: error.message
            } as IErrorResponse);
            return;
        }

        const statusCode = error.statusCode || 500;
        reply.status(statusCode).send({
            success: false,
            message: error.message,
            errorCode: error.code || "INTERNAL_SERVER_ERROR"
        } as IErrorResponse);
    });

    await app.listen({
        port: Number(env.PORT),
        host: "0.0.0.0"
    });
}

app.register(pongController);

//TODO: REMOVE THIS ON PROD
app.register(fastifyStatic, {
    root: path.join(__dirname, "../public"),
    prefix: "/" // so it serves at http://localhost:3000/
});

app.get(process.env.BASE_ROUTE + "/healthcheck", (_req, response) => {
    response.send({ message: "Success" });
});

start();
