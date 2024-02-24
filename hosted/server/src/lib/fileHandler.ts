import { ServerWebSocket } from 'bun';
import { Message } from '../server';
import { CLIENT_LOCATION } from '../config';

export async function writeFile(ws: ServerWebSocket, message: Message) {
	const path = `${CLIENT_LOCATION}/${message.path}`
	try {
		const res = await Bun.write(path, `${message.content}`)
		ws.publish('onlook-editor', JSON.stringify(message));

		if (typeof res !== 'number') {
			console.error('Failed to write file:', path, res);
		}
	} catch (error) {
		console.error('Failed to process message:', error);
		ws.send('Error processing changes');
	}
}

export async function readFile(ws: ServerWebSocket, message: Message) {
	const path = `${CLIENT_LOCATION}/${message.path}`
	try {
		const contents = await Bun.file(path).text();
		ws.send(JSON.stringify({ type: 'readFile', path, content: contents }));
	} catch (error) {
		console.error('Failed to read file:', path, error);
		ws.send(JSON.stringify({ type: 'error', message: `Failed to read file: ${message.path}` }));
	}
}
