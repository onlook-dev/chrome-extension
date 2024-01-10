import { EventMetadataImpl, EventMetadataType } from './metadata';
import type { UserImpl } from './user';

// All the changes that happen to an element when switched to another element
interface ChangeSet {
	id: string;
	selector: string;
	stylesObj: Map<string, string>;
	author: UserImpl; // TODO: Reference by ID instead
	metadata: EventMetadataImpl[];
	visible: boolean;
}

export class ChangeSetImpl implements ChangeSet {
	id: string;
	selector: string;
	stylesObj: Map<string, string>;
	metadata: EventMetadataImpl[];
	author: UserImpl;
	visible: boolean;
	constructor({ id, selector, stylesObj: styleChanges, metadata, author, visible }: ChangeSet) {
		this.id = id;
		this.selector = selector;
		this.stylesObj = styleChanges;
		this.metadata = metadata;
		this.author = author;
		this.visible = visible ?? true;
	}

	// Update styles
	updateStyles(styleChanges: Map<string, string>) {
		this.stylesObj = styleChanges;
	}

	// Update metadata
	updateMetadata(metadata: EventMetadataImpl[]) {
		this.metadata = metadata;
	}

	// Check if style object is an empty object
	isStyleEmpty() {
		return Object.keys(this.stylesObj).length === 0;
	}

	// Toggle visible
	toggleVisible(visible?: boolean) {
		this.visible = visible ?? !this.visible;
	}

	getMetadataByType(type: EventMetadataType): EventMetadataImpl | undefined {
		return this.metadata.find((m) => m.type === type);
	}
}
