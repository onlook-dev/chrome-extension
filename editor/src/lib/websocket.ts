import { SERVER_SOCKET_URL } from "./config";

type MessageHandler = (message: any) => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private readonly url: string;
  private messageHandlers: Set<MessageHandler> = new Set();

  constructor(url: string) {
    this.url = url;
  }

  connect(path: string): void {
    this.ws = new WebSocket(`${this.url}/${path}`);

    this.ws.onopen = () => {
      this.sendMessage({ type: "readFile", path, content: "" });
    };

    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      this.messageHandlers.forEach(handler => handler(message));
    };

    this.ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    this.ws.onclose = () => {
      console.log("WebSocket connection closed");
    };
  }

  sendMessage(message: object): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.error("WebSocket is not open.");
    }
  }

  subscribe(handler: MessageHandler): () => void {
    this.messageHandlers.add(handler);
    return () => this.messageHandlers.delete(handler);
  }

  disconnect(): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.close();
    }
  }
}

export const websocketService = new WebSocketService(SERVER_SOCKET_URL);
