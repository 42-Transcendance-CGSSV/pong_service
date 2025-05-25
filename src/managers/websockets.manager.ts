export default class WebsocketsManager {

    public readonly connections: Set<WebSocket> = new Set();
    private static instance: WebsocketsManager | null = null;

    public addConnection(socket: WebSocket): void {
        this.connections.add(socket);
    }

    public removeConnection(socket: WebSocket): void {
        this.connections.delete(socket);
    }

    public countConnections(): number {
        return this.connections.size;
    }

    public flushConnections(): void {
        this.connections.forEach(socket => {
            if (socket.readyState === WebSocket.OPEN) {
                socket.close();
            }
        });
        this.connections.clear();
    }

    public static getInstance(): WebsocketsManager {
        return this.instance ? this.instance : (this.instance = new WebsocketsManager());
    }

}