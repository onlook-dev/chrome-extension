import { config } from './config';
import { ServerWebSocket } from 'bun';
import { readFile, writeFile } from './lib/fileHandler';

export interface Message {
	type: string;
	path: string;
	content: string;
}

const server = Bun.serve({
	hostname: config.host,
	port: config.port,

	fetch(req, server): Response | undefined {
		// Attempt to upgrade the incoming request to a WebSocket connection
		if (server.upgrade(req)) {
			// If upgrade succeeds, automatically returns a 101 Switching Protocols
			return undefined;
		} else {
			// Handle HTTP request normally
			return new Response('Not a WebSocket request.');
		}
	},
	websocket: {
		open(ws: ServerWebSocket) {
			ws.subscribe('onlook-editor');
			console.log('A new connection has been opened and subscribed to file updates.');
		},
		async message(ws: ServerWebSocket, message: string) {
			const parsedMessage: Message = JSON.parse(message);

			switch (parsedMessage.type) {
				case 'readFile':
					await readFile(ws, parsedMessage);
					break;
				case 'writeFile':
					writeFile(ws, parsedMessage); // Pass the WebSocket connection and the message to writeChanges
					break;
				default:
					console.error('Unsupported message type:', parsedMessage.type);
			}
		},
		close(ws: ServerWebSocket) {
			ws.unsubscribe('onlook-editor');
			console.log('A connection has been closed and unsubscribed from file updates.');
		}
	}
});

console.log(`Server is running on http://${server.hostname}:${server.port}`);
