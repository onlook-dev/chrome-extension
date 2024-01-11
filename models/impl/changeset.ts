import type { ChangeSet, StyleChange } from '$models/changeset';
import type { EventMetadata } from '$models/eventData';

export class ChangeSetImpl implements ChangeSet {
	id: string;
	userId: string;
	selector: string;
	projectId: string;
	eventData: EventMetadata[];
	visible: boolean;
	styleChanges: StyleChange[];

	constructor({ id, userId, selector, projectId, eventData, visible, styleChanges }: ChangeSet) {
		this.id = id;
		this.userId = userId;
		this.selector = selector;
		this.projectId = projectId;
		this.eventData = eventData;
		this.visible = visible;
		this.styleChanges = styleChanges;
	}

	// TODO: Add help methods
}
