import type {WebSocket} from "ws";
import {setInterval} from "node:timers";
import {app} from "../app";


export default class WebsocketsManager {
	private static instance: WebsocketsManager | null = null;

	private socketToUserId: Map<WebSocket, number> = new Map();
	private userIdToSocket: Map<number, WebSocket> = new Map();
	private pingTask: NodeJS.Timeout | null = null;

	public constructor() {
		this.pingTask = setInterval(() => {
			for (const socket of this.socketToUserId.keys()) {
				try {
					socket.ping();
				} catch (error) {
					app.log.error("Unable to send ping to the user ", this.socketToUserId.get(socket));
					app.log.error(error);
				}
			}
		})
	}

	public static getInstance(): WebsocketsManager {
		return this.instance ? this.instance : (this.instance = new WebsocketsManager());
	}

	public addConnection(socket: WebSocket, userId: number): boolean {
		if (this.userIdToSocket.has(userId)) {
			const prevSock = this.userIdToSocket.get(userId);
			if (prevSock === socket) return false;
			if (prevSock!.OPEN) this.removeConnection(prevSock!);
		}
		this.socketToUserId.set(socket, userId);
		this.userIdToSocket.set(userId, socket);
		return true;
	}

	public removeConnection(socket: WebSocket): number {
		const userId = this.socketToUserId.get(socket);
		if (userId !== undefined) {
			this.socketToUserId.delete(socket);
			this.userIdToSocket.delete(userId);
		}
		if (socket.OPEN) socket.close();
		return userId ? userId : -1;
	}

	public getUserIdFromSocket(socket: WebSocket): number | null {
		return this.socketToUserId.get(socket) ?? null;
	}

	public getSocketFromUserId(userId: number): WebSocket | null {
		return this.userIdToSocket.get(userId) ?? null;
	}

	public countConnections(): number {
		return this.socketToUserId.size;
	}

	public flushConnections(): void {
		if (this.pingTask) {
			this.pingTask.close();
			this.pingTask = null;
		}
		for (const [socket] of this.socketToUserId) {
			if (socket.OPEN) {
				socket.close();
			}
		}
		this.socketToUserId.clear();
		this.userIdToSocket.clear();
	}
}