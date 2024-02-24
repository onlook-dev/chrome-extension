const WS_PROTOCOL = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const WS_HOST_NAME = window.location.hostname ?? 'localhost';
const WS_PORT = process.env.SERVER_PORT ?? '8001';

export const SERVER_SOCKET_URL = `${WS_PROTOCOL}//${WS_HOST_NAME}:${WS_PORT}`; // Use the same host and protocol as the client