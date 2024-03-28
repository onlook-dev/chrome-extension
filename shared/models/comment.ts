import type { EventMetadata } from "./eventData";

export interface Comment {
  id: string;
  userId: string;
  projectId: string;
  text?: string;
  media: CommentMedia[];
  metadata: EventMetadata[];
  createdAt: string;
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
