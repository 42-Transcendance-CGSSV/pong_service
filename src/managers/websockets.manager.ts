type PlayerSocket = {
    socket: WebSocket;
    Player_id?: number;
}

export default class WebsocketsManager {

    public readonly connections: Set<PlayerSocket> = new Set();
    private static instance: WebsocketsManager | null = null;

    public addConnection(socket: WebSocket): void {
        this.connections.add({socket, Player_id: undefined} as PlayerSocket);
    }

    public removeConnection(socket: WebSocket): void {
        this.connections.delete({socket, Player_id: undefined} as PlayerSocket);
    }

    public updateIdentity(socket: WebSocket, Player_id: number): boolean {
        for (const con of this.connections) {
            if (con.socket === socket) {
                con.Player_id = Player_id;
                return true;
            }
        }
        return false;
    }

    public removeConnectionFromId(Player_id: number): boolean {
        for (const playerSocket of this.connections) {
            if (playerSocket.Player_id === Player_id) {
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