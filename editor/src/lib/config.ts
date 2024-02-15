const SERVER_HTTP_URL = new URL(process.env.NGROK_SERVER_URL || process.env.SERVER_URL || 'http://localhost:4444');
const SERVER_PROTOCOL = SERVER_HTTP_URL.protocol === 'https:' ? 'wss' : 'ws';
export const SERVER_SOCKET_URL = `${SERVER_PROTOCOL}://${SERVER_HTTP_URL.host}`;
