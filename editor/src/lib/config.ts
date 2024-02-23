const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
export const SERVER_SOCKET_URL = `${wsProtocol}://${window.location.host}`; // Use the same host and protocol as the client
