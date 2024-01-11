import type { Comment, CommentMedia, CommentMediaType } from '$models/comment';
import type { EventMetadata } from '$models/eventData';

export class CommentImpl implements Comment {
	id: string;
	userId: string;
	projectId: string;
	text?: string;
	media: CommentMedia[];
	metadata: EventMetadata[];
	timestamp: Date;
	open: boolean;
	thread: Comment[];

	constructor({ id, userId, projectId, text, metadata, media, timestamp, open, thread }: Comment) {
		this.id = id;
		this.userId = userId;
		this.projectId = projectId;
		this.text = text;
		this.metadata = metadata;
		this.media = media;
		this.timestamp = timestamp;
		this.open = open;
		this.thread = thread;
	}
}

export class CommentMediaImpl implements CommentMedia {
	type: CommentMediaType;
	localUrl?: string;
	remoteUrl?: string;
	blob?: Blob;

	constructor({ type, localUrl }: CommentMedia) {
		this.type = type;
		this.localUrl = localUrl;
	}

	get url() {
		// Get localUrl if possible, otherwise get remote URL or generate URL from blob
		if (this.localUrl) {
			return this.localUrl;
		} else if (this.remoteUrl) {
			return this.remoteUrl;
		} else if (this.blob) {
			return URL.createObjectURL(this.blob);
		}
	}
}

export function getInitials(name: string) {
	const initials = name
		.split(' ')
		.map((word) => word[0])
		.join('');
	return initials.toUpperCase();
}

export function timeSince(date: Date) {
	// @ts-expect-error - Date arithmetic overrides
	const seconds = Math.floor((new Date() - date) / 1000);
	let interval = seconds / 31536000;

	if (interval > 1) {
		return Math.floor(interval) + 'y';
	}
	interval = seconds / 2592000;
	if (interval > 1) {
		return Math.floor(interval) + 'm';
	}
	interval = seconds / 86400;
	if (interval > 1) {
		return Math.floor(interval) + 'd';
	}
	interval = seconds / 3600;
	if (interval > 1) {
		return Math.floor(interval) + 'h';
	}
	interval = seconds / 60;
	if (interval > 1) {
		return Math.floor(interval) + 'm';
	}
	return Math.floor(seconds) + 's';
}
