import { ServerWebSocket } from 'bun';
import { Message } from '../server';

export function writeFile(ws: ServerWebSocket, message: Message) {
	try {
		try {
			Bun.write(message.path, `${message.content}`);
			console.log(`File ${message.path} has been updated.`);

			ws.publish('onlook-editor', JSON.stringify(message));
		} catch (error) {
			console.error(`Failed to write changes to ${message.path}:`, error);
		}
	} catch (error) {
		console.error('Failed to process message:', error);
		ws.send('Error processing changes');
	}
}

export async function readFile(ws: ServerWebSocket, path: string) {
	try {
		const contents = await Bun.file(path).text();
		if (contents) console.log('got file');

		ws.send(JSON.stringify({ type: 'readFile', path, content: contents }));
	} catch (error) {
		console.error('Failed to read file:', path, error);
		ws.send(JSON.stringify({ type: 'error', message: `Failed to read file: ${path}` }));
	}
}
