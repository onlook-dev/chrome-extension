import type { EventMetadata } from "./eventData";

export interface Comment {
	id: string;
	userId: string;
	projectId: string;
	text?: string;
	media: CommentMedia[];
	metadata: EventMetadata[];
	timestamp: Date;
	open: boolean;
	thread: Comment[];
}

export interface CommentMedia {
	type: CommentMediaType;
	localUrl?: string;
	remoteUrl?: string;
	blob?: Blob;
}

export enum CommentMediaType {
	IMAGE = "image",
	VIDEO = "video",
	FILE = "file",
}

export function getInitials(name: string) {
	const initials = name
		.split(" ")
		.map((word) => word[0])
		.join("");
	return initials.toUpperCase();
}
