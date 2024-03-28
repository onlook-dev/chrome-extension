import { SERVER_SOCKET_URL } from "./config";
type MessageHandler = (message: any) => void;

class WebSocketService {
  private handshakeWs: WebSocket | null = null;
  private ws: WebSocket | null = null;
  private readonly url: string;
  private messageHandlers: Set<MessageHandler> = new Set();

  // Handle connection errors
  private retryCount: number = 0;
  private maxRetries: number = 5;
  private retryDelay: number = 1000;

  constructor(url: string) {
    this.url = url;
  }

  handshake(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (this.handshakeWs) {
        this.handshakeWs.close();
      }
      this.handshakeWs = new WebSocket(this.url);

      const timeout = setTimeout(() => {
        this.handshakeWs.close();
        resolve(false);
      }, 2000);

      this.handshakeWs.onopen = () => {
        clearTimeout(timeout);
        this.handshakeWs.close();
        resolve(true);
      };
      this.handshakeWs.onerror = (error) => {
        this.handshakeWs.close();
        resolve(false);
      };
    });
  }

  connect(path: string): void {
    this.ws = new WebSocket(`${this.url}/${path}`);

    this.ws.onopen = () => {
      this.retryCount = 0;
      this.sendMessage({ type: "readFile", path, content: "" });
    };

    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      this.messageHandlers.forEach(handler => handler(message));
    };

    this.ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      this.handleConnectionError(path);
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

  handleConnectionError(path: string): void {
    if (this.retryCount < this.maxRetries) {
      setTimeout(() => {
        console.log(`Attempting to reconnect... Attempt ${this.retryCount + 1}`);
        this.connect(path);
      }, this.retryDelay * Math.pow(2, this.retryCount));

      this.retryCount++;
    } else {
      console.error("Max retries reached. Unable to connect to WebSocket.");
    }
  }
}

export const websocketService = new WebSocketService(SERVER_SOCKET_URL);
