import { EventMetadata } from "./eventData";

// All the changes that happen to an element when switched to another element
export interface ChangeSet {
    id: string;
    userId: string;
    selector: string;
    projectId: string;
    eventData: EventMetadata[];
    visible: boolean;

    // TODO: Handle content changes + structure changes
    styleChanges: StyleChange[];
}

export interface StyleChange {
    key: string;
    oldVal: string;
    newVal: string;
}
