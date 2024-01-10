import type { EventMetadataImpl } from './metadata';
import type { UserImpl } from './user';

interface Comment {
	id: string;
	text?: string;
	media: CommentMediaImpl[];
	author: UserImpl;
	metadata: EventMetadataImpl[];
	timestamp: Date;
}

interface CommentMedia {
	type: CommentMediaType;
	localUrl?: string;
	remoteUrl?: string;
	blob?: Blob;
}

export enum CommentMediaType {
	IMAGE = 'image',
	VIDEO = 'video',
	FILE = 'file'
}

export class CommentImpl implements Comment {
	id: string;
	text?: string;
	media: CommentMediaImpl[];
	author: UserImpl;
	metadata: EventMetadataImpl[];
	timestamp: Date;

	constructor({ id, text, media, author, metadata, timestamp }: Comment) {
		this.id = id;
		this.text = text;
		this.media = media;
		this.author = author;
		this.metadata = metadata;
		this.timestamp = timestamp;
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
