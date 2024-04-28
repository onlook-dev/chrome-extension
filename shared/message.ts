// Messaging
export enum MessageType {
    DASHBOARD_AUTH = "DASHBOARD_AUTH",
    EDIT_EVENT = "EDIT_EVENT",
    SAVE_PROJECT = "SAVE_PROJECT",
    EDIT_PROJECT = "EDIT_PROJECT",
}

export interface IMessage {
    type: MessageType;
    payload: string;
    origin?: string;  // Include origin in the message for checking
}

export class MessageService {
    private static instance: MessageService;
    private listeners: Map<MessageType, Function[]> = new Map();
    private allowedOrigins: Set<string>;

    private constructor(allowedOrigins: string[]) {
        // Wait until window exists
        if (typeof window === 'undefined') {
            throw new Error("MessageService should be used in the browser environment");
        }
        this.allowedOrigins = new Set(allowedOrigins);
        this.allowedOrigins.add(window.location.origin);
        // Listen to the window messages
        window.addEventListener('message', this.handleMessage.bind(this));
    }

    public static getInstance(allowedOrigins: string[] = []): MessageService {
        if (!MessageService.instance) {
            MessageService.instance = new MessageService(allowedOrigins);
        } else {
            allowedOrigins.forEach(origin => {
                MessageService.instance.allowedOrigins.add(origin);
            });
        }
        return MessageService.instance;
    }

    private handleMessage(event: MessageEvent) {
        if (this.allowedOrigins.has(event.origin)) {
            const message: IMessage = event.data;
            const subscribers = this.listeners.get(message.type);
            if (subscribers) {
                subscribers.forEach(callback => callback(JSON.parse(message.payload)));
            }
        } else {
            console.error("Received message from unauthorized origin:", event.origin);
        }
    }

    subscribe(messageType: MessageType, callback: (payload: any) => void): void {
        if (!this.listeners.has(messageType)) {
            this.listeners.set(messageType, []);
        }
        this.listeners.get(messageType)?.push(callback);
    }

    unsubscribe(messageType: MessageType, callback: Function): void {
        const subscribers = this.listeners.get(messageType);
        if (subscribers) {
            const index = subscribers.indexOf(callback);
            if (index !== -1) {
                subscribers.splice(index, 1);
            }
        }
    }

    publish(type: MessageType, payload?: any): void {
        // Just send the message without checking the origin here
        const message: IMessage = { type, payload: JSON.stringify(payload) };
        window.postMessage(message, window.location.origin);  // Using '*' for targetOrigin or specify if needed
    }
}
