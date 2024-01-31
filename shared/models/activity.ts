import type { EventMetadata } from "./eventData";

// All the changes that happen to an element when switched to another element
export interface Activity {
  id: string;
  userId: string;
  selector: string;
  path?: string; // '<encodedPath>' -> path/to/file:line
  projectId: string;
  eventData: EventMetadata[];
  visible: boolean;
  previewImage?: string;

  creationTime?: string; // Old, migrating
  createdAt: string; // New, migrating

  // TODO: Handle content changes + structure changes
  styleChanges: Record<string, StyleChange>;
}

export interface StyleChange {
  key: string;
  oldVal: string;
  newVal: string;
}
