import type { EventMetadata } from "./eventData";

// All the changes that happen to an element when switched to another element
export interface Activity {
  id: string;
  userId: string;
  selector: string;
  projectId: string;
  eventData: EventMetadata[];
  visible: boolean;
  creationTime: Date;
  // TODO: Handle content changes + structure changes
  styleChanges: StyleChange[];
}

export interface StyleChange {
  key: string;
  oldVal: string;
  newVal: string;
}
