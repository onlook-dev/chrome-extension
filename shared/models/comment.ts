import type { EventMetadata } from "./eventData";

export interface Comment {
  id: string;
  userId: string;
  projectId: string;
  text?: string;
  media: CommentMedia[];
  metadata: EventMetadata[];
  creationTime: Date;
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

export function timeSince(date: Date) {
  // @ts-ignore - Date arithmetic overrides
  const seconds = Math.floor((new Date() - date) / 1000);
  let interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + "y";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + "m";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + "d";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + "h";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + "m";
  }
  return Math.floor(seconds) + "s";
}