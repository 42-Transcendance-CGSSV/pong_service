import fastify from "fastify";

import {EventEmitter} from "events"
import {env} from "./utils/environment";

import {pongController} from "./controllers/controller.game";
import PongEngine from "./pongEngine";
import ApiError from "./utils/error.util";
import {IErrorResponse} from "./interfaces/response.interface";
import {websocketRegistry} from "./websockets/websocket.registry";
import {registerGetIaNeededData} from "./websockets/channels/getIANeededData";
import {registerGetPlayerDataChannel} from "./websockets/channels/getPlayerDataChannel";
import {registerGetScoreRegistry} from "./websockets/channels/getScoreRegistryChannel";
import {registerMovePaddleChannel} from "./websockets/channels/movePaddleChannel";
import {registerTogglePauseMatchChannel} from "./websockets/channels/togglePauseChannel";
import AuthenticationMiddleware from "./middlewares/authentication.middleware";
import fastifyCookie from "@fastify/cookie";
import fastifyWebsocket from "@fastify/websocket";
import {registerPlayerReadyChannel} from "./websockets/channels/setPlayerReadyChannel";

export const app = fastify({
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
export const eventEmitter = new EventEmitter();

async function start(): Promise<void> {
	try {
		app.register(fastifyWebsocket);
		app.register(fastifyCookie);

		app.log.info("Setup websocket processor...");
		await websocketRegistry(app);
		registerGetIaNeededData();
		registerGetPlayerDataChannel();
		registerGetScoreRegistry();
		registerMovePaddleChannel();
		registerTogglePauseMatchChannel();
		registerPlayerReadyChannel();
		app.log.info("Websocket processor is OK !");

		new AuthenticationMiddleware().register(app);

		PongEngine.getInstance().startGameLoop();

		app.register(pongController);

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

		await app.listen({port: 3001, host: "0.0.0.0"});
	} catch (error) {
		app.log.error(error);
		process.exit(1);
	}
}

app.get("/healthcheck", (_req, response) => {
	response.send({message: "Success"});
});

start().then(() => app.log.info("Pong service started"));
