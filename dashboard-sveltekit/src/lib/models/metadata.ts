interface EventMetadata {
	key: string;
	value: string;
	type: EventMetadataType;
}

export enum EventMetadataType {
	SCREEN_SIZE = 'screen-size',
	BROWSER = 'browser',
	OS = 'os',
	TIME_STAMP = 'time-stamp',
	SOURCE_MAP_ID = 'source-map-id'
}

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
