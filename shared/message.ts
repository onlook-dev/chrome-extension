export enum MessageType {
    DASHBOARD_AUTH = "DASHBOARD_AUTH",
    EDIT_EVENT = "EDIT_EVENT",
    SAVE_PROJECT = "SAVE_PROJECT",
    EDIT_PROJECT = "EDIT_PROJECT",
    GET_PROJECT = "GET_PROJECT",

    // Generic type to get callback response
    RESPONSE = "RESPONSE"
}

export interface IMessage {
    type: MessageType;
    payload: string;
    correlationId?: string;
    origin?: string;
}

/*
    Usage:

    const messageService = MessageService.getInstance();
    // Publish and get response
    messageService.publish(MessageType.GET_PROJECT, { projectId: "123" }, (response) => {
        console.log("Received project data:", response);
    });

    // Subscribe to a message type and send response
    if (correlationId) {
        messageService.publish(MessageType.RESPONSE, { status: "Edit successful" }, response => {
            console.log("Edit response sent back.");
        }, correlationId);
    }
 */

export class MessageService {
    private static instance: MessageService;
    private listeners: Map<MessageType | string, Function[]> = new Map();
    private allowedOrigins: Set<string>;

    private constructor(allowedOrigins: string[]) {
        if (typeof window === 'undefined') {
            throw new Error("MessageService should be used in the browser environment");
        }
        this.allowedOrigins = new Set(allowedOrigins);
        this.allowedOrigins.add(window.location.origin);
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
            // Handle general subscribers
            const subscribers = this.listeners.get(message.type);
            if (subscribers) {
                subscribers.forEach(callback => callback(JSON.parse(message.payload), message.correlationId));
            }

            // Handle correlation-specific callbacks if correlationId is provided
            if (message.correlationId) {
                const correlationCallbacks = this.listeners.get(message.correlationId);
                if (correlationCallbacks) {
                    correlationCallbacks.forEach(callback => callback(JSON.parse(message.payload)));
                    this.listeners.delete(message.correlationId); // Clean up after handling
                }
            }
        } else {
            console.error("Received message from unauthorized origin:", event.origin);
        }
    }

    subscribe(messageType: MessageType, callback: (payload: any, correlationId?: string) => void): void {
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

    // Callback will listen for a response
    publish(type: MessageType, payload?: any, callback?: (response: any) => void): void {
        const correlationId = callback ? crypto.randomUUID() : undefined;
        const message: IMessage = { type, payload: JSON.stringify(payload), correlationId };

        // Register the callback only if a correlationId is generated
        if (correlationId && callback) {
            this.listeners.set(correlationId, [callback]);
        }

        window.postMessage(message, window.location.origin);
    }

    respond(payload: any, correlationId: string): void {
        if (!correlationId) {
            throw new Error("Response requires a valid correlationId.");
        }

        const message: IMessage = { type: MessageType.RESPONSE, payload: JSON.stringify(payload), correlationId };
        window.postMessage(message, window.location.origin);
    }
}
