import AMiddleware from "../classes/abstracts/AMiddleware";
import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {IErrorResponse} from "../interfaces/response.interface";
import axios from "axios";
import {toCamelCase} from "../utils/case.util";
import ApiError, {ApiErrorCode} from "../utils/error.util";
import {env} from "../utils/environment";


export interface IPublicUser {
	id: number;
	name: string;
	email: string;
	createdAt: number;
	verified: boolean;

	totpEnabled: boolean;
	hasPassedTotp: boolean;
}


/**
 * @description Middleware to verify the JWT token and add the user to the request
 */
declare module "fastify" {
	interface FastifyRequest {
		publicUser?: IPublicUser;
	}
}

/**
 * @description Middleware to verify the JWT token and add the user to the request
 * @class AuthenticationMiddleware
 * @extends AMiddleware
 */
class AuthenticationMiddleware extends AMiddleware {
	public constructor() {
		super();
		this.addRoute("/pong-ws");
	}

	/**
	 * @description Middleware to verify the JWT token and add the user to the request
	 * @param _app Fastify instance
	 * @param request Fastify request
	 * @param response Fastify response
	 */
	public async handleRequest(_app: FastifyInstance, request: FastifyRequest, response: FastifyReply): Promise<boolean> {
		try {
			request.publicUser = undefined;
			if (!request.headers.cookie) throw new ApiError(ApiErrorCode.INVALID_TOKEN, "Pas de cookies recus");

			const cookies = request.cookies;
			if (cookies["BACKEND_TOKEN"]) {
				const token = cookies["BACKEND_TOKEN"];
				if (token !== env.BACKEND_TOKEN) throw new ApiError(ApiErrorCode.INSUFFICIENT_PERMISSIONS, "Invalid backend token.");
				request.publicUser = {
					id: 0,
					createdAt: Date.now(),
					email: "ft_transcendence@gmail.com",
					hasPassedTotp: false,
					totpEnabled: false,
					verified: true,
					name: "Pong IA"
				}
				return true;
			}

			const decodeResponse = await axios.get("http://ft-transcendence-auth:3000/token/decode", {
				headers: {
					Cookie: request.headers.cookie || ""
				}
			});

			if (!decodeResponse.data || !decodeResponse.data.data) throw new ApiError(ApiErrorCode.INVALID_TOKEN);

			if (needEmailVerification(decodeResponse.data.data)) throw new ApiError(ApiErrorCode.UNAUTHORIZED, "Vous devez dabord verifier votre compte");
			if (needTwoFactor(decodeResponse.data.data)) throw new ApiError(ApiErrorCode.UNAUTHORIZED, "Vous devez passer le processus d'authentification à deux facteurs !");

			request.publicUser = toCamelCase(decodeResponse.data.data) as IPublicUser;

			return true;
		} catch (error) {
			if (error instanceof ApiError) {
				response.status(401).send({
					success: false,
					errorCode: error.code,
					message: error.message
				} as IErrorResponse);
			}
			return false;
		}
	}
}


function needEmailVerification(payload: unknown): boolean {
	return (typeof payload === "object" && payload !== null && "verified" in payload && !payload.verified) as boolean;
}

function needTwoFactor(payload: unknown): boolean {
	return (typeof payload === "object" &&
		payload !== null &&
		"totp_enabled" in payload &&
		payload.totp_enabled &&
		"has_passed_totp" in payload &&
		!payload.has_passed_totp) as boolean;
}

export default AuthenticationMiddleware;
