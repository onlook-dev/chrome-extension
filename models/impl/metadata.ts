import type { EventMetadata, EventMetadataType } from '$models/eventData';

export class EventMetadataImpl implements EventMetadata {
	key: string;
	value: string;
	type: EventMetadataType;

	constructor({ key, value, type }: EventMetadata) {
		this.key = key;
		this.value = value;
		this.type = type;
	}
}
