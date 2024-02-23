export const config = {
	host: process.env.HOST || '0.0.0.0',
	port: process.env.PORT || 8080
};

export type WebSocketData = {
	createdAt: number;
	userId: string;
};
