export default class WsEvent {

    private readonly channel: string;
    private readonly data?: unknown;

    public constructor(channel: string, data: unknown) {
        this.channel = channel;
        this.data = data;
    }

    public getChannel(): string {
        return this.channel;
    }

    public getData(): unknown {
        return this.data;
    }

    public getDataAsObject() {
        if (this.data && typeof this.data === "object") {
            return this.data as Record<string, unknown>;
        }
        return null;
    }
}