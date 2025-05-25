type PlayerSocket = {
    socket: WebSocket;
    playerId?: string;
}

export default class WebsocketsManager {

    public readonly connections: Set<PlayerSocket> = new Set();
    private static instance: WebsocketsManager | null = null;

    public addConnection(socket: WebSocket): void {
        this.connections.add({socket, playerId: undefined} as PlayerSocket);
    }

    public removeConnection(socket: WebSocket): void {
        this.connections.delete({socket, playerId: undefined} as PlayerSocket);
    }

    public updateIdentity(socket: WebSocket, playerId: string): boolean {
        for (const con of this.connections) {
            if (con.socket === socket) {
                con.playerId = playerId;
                return true;
            }
        }
        return false;
    }

    public removeConnectionFromId(playerId: string): boolean {
        for (const playerSocket of this.connections) {
            if (playerSocket.playerId === playerId) {
                this.connections.delete(playerSocket);
                return true;
            }
        }
        return false;
    }

    public countConnections(): number {
        return this.connections.size;
    }

    public flushConnections(): void {
        this.connections.forEach(socket => {
            if (socket.socket.OPEN) {
                socket.socket.close(1234, "Server is shutting down"); //TODO use a proper close code
            }
        });
        this.connections.clear();
    }

    public static getInstance(): WebsocketsManager {
        return this.instance ? this.instance : (this.instance = new WebsocketsManager());
    }

}