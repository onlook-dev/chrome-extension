export const MESSAGING_NAMESPACE = "aa5d4a6b-d04d-4cb4-8476-3cc14241facd";

export enum MessageType {
    TOGGLE_EDITOR = "TOGGLE_EDITOR",

    // Auth
    DASHBOARD_SIGN_IN = "DASHBOARD_SIGN_IN",
    DASHBOARD_SIGN_OUT = "DASHBOARD_SIGN_OUT",

    // Project
    OPEN_URL = "OPEN_URL",
    SHOULD_TOUR = "SHOULD_TOUR",

    // Edit
    EDIT_EVENT = "EDIT_EVENT",
    EDIT_PROJECT = "EDIT_PROJECT",
    MERGE_PROJECT = "MERGE_PROJECT",
    APPLY_EDIT_EVENTS = "APPLY_EDIT_EVENTS",
    REVERT_EDIT_EVENTS = "REVERT_EDIT_EVENTS",

    // Getting project
    GET_PROJECT = "GET_PROJECT",
    GET_PROJECTS = "GET_PROJECTS",

    // Saving project
    PREPARE_SAVE = "PREPARE_SAVE",
    PUBLISH_PROJECT = "PUBLISH_PROJECT",

    // Chat
    SEND_CHAT_MESSAGE = "SEND_CHAT_MESSAGE",

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
        console.only("Received project data:", response);
    });

    // Subscribe to a message type and send response
    if (correlationId) {
        messageService.publish(MessageType.RESPONSE, { status: "Edit successful" }, response => {
            console.only("Edit response sent back.");
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
        // TODO: Check that same origin message came from Onlook
        if (this.allowedOrigins.has(event.origin)) {
            const message: IMessage = event.data;
            let payload = message.payload ? JSON.parse(message.payload) : message.payload;

            // Handle general subscribers
            const subscribers = this.listeners.get(message.type);
            if (subscribers) {
                subscribers.forEach(callback => callback(payload, message.correlationId));
            }

            // Handle correlation-specific callbacks if correlationId is provided
            if (message.correlationId && message.type === MessageType.RESPONSE) {
                const correlationCallbacks = this.listeners.get(message.correlationId);
                if (correlationCallbacks) {
                    correlationCallbacks.forEach(callback => callback(payload));
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
