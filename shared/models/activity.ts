import type { StructureVal } from "./editor";
import type { EventMetadata } from "./eventData";

// All the changes that happen to an element when switched to another element
export interface Activity {
  id: string;
  userId: string;
  selector: string;
  path?: string; // '<encodedPath>' -> path/to/file:startLine:starTagEndLine:endLine
  snapshot?: string;
  projectId: string;
  eventData: EventMetadata[];
  visible: boolean;
  beforeImage?: string;
  previewImage?: string;

  createdAt: string;
  updatedAt?: string;

  styleChanges: Record<string, ChangeValues>;
  textChanges?: Record<string, ChangeValues>;
  attributeChanges?: Record<string, ChangeValues>;

  // TODO: Finish implementing this
  insertChildChanges?: Record<string, ChangeValues>;
  deleteChildChanges?: Record<string, ChangeValues>;
  moveChildChanges?: Record<string, ChangeValues>;

  // Handles the code written to GitHub
  status?: ActivityStatus;
  codeChangeId?: string;
}

export interface ChangeValues {
  key: string;
  oldVal: string | StructureVal;
  newVal: string | StructureVal;
}

export enum ActivityStatus {
  EDITED = 'EDITED',
  TRANSLATION_IN_PROGRESS = 'TRANSLATION_IN_PROGRESS',
  TRANSLATION_SUCCESS = 'TRANSLATION_SUCCESS',
  TRANSLATION_FAILED = 'TRANSLATION_FAILED',
  PUBLISH_IN_PROGRESS = 'PUBLISH_IN_PROGRESS',
  PUBLISH_SUCCESS = 'PUBLISH_SUCCESS',
  PUBLISH_FAILED = 'PUBLISH_FAILED',
  ARCHIVED = 'ARCHIVED',
}
