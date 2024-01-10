import { UserImpl } from './user';
import { CommentImpl } from './comment';
import { ChangeSetImpl } from './changeset';

// A project is a set of feedback, comments, and style changes
interface ProjectPreview {
	id: string;
	name: string;
	owner: string;
}

export class ProjectPreviewImpl implements ProjectPreview {
	id: string;
	name: string;
	owner: string;

	constructor({ id, name, owner }: ProjectPreview) {
		this.id = id;
		this.name = name;
		this.owner = owner;
	}
}

interface Project {
	id: string;
	name: string;
	author: UserImpl;
	host: string;
	changeSets: ChangeSetImpl[];
	comments: CommentImpl[];
	version: number;
	previewImage: string | undefined;
}

// TODO: Changeset should be edited if selector already exists.

export class ProjectImpl implements Project {
	readonly id: string;
	name: string;
	readonly author: UserImpl;

	host: string;
	changeSets: ChangeSetImpl[];
	comments: CommentImpl[];
	version: number;
	previewImage: string | undefined;

	constructor({ id, name, author, host, changeSets, comments, version }: Project) {
		this.id = id;
		this.name = name;
		this.author = author;
		this.host = host;
		this.changeSets = changeSets?.map((changeSet) => new ChangeSetImpl(changeSet));
		this.comments = comments?.map((comment) => new CommentImpl(comment));
		this.version = version;
	}

	// Replace last item in changesets
	replaceLastItemInChangeSet(changeSet: ChangeSetImpl) {
		const clonedChangeSet = new ChangeSetImpl(changeSet);
		// If no changeset, add it instead
		if (this.changeSets.length === 0) {
			this.changeSets.push(clonedChangeSet);
			return;
		}
		this.changeSets[this.changeSets.length - 1] = clonedChangeSet;
	}

	// Replace changeset if exists
	replaceOrAppendChangeSet(changeSet: ChangeSetImpl) {
		const clonedChangeSet = new ChangeSetImpl(changeSet);
		const index = this.changeSets.findIndex((item) => item.id === clonedChangeSet.id);
		if (index !== -1) {
			this.changeSets[index] = clonedChangeSet;
		} else {
			this.changeSets.push(clonedChangeSet);
		}
	}

	// Remove changeset if exists
	removeChangeSet(changeSet: ChangeSetImpl) {
		this.changeSets = this.changeSets.filter((item) => item.id !== changeSet.id);
	}

	// Get last item in changesets
	getLastChangeSet() {
		return this.changeSets[this.changeSets.length - 1];
	}

	// Get changesets length
	getChangeSetsLength() {
		return this.changeSets.length;
	}

	removeLastComment() {
		this.comments.pop();
	}

	addComment(comment: CommentImpl) {
		this.comments.push(comment);
	}

	getPreview(): ProjectPreviewImpl {
		return new ProjectPreviewImpl({
			id: this.id,
			name: this.name,
			owner: this.author.name
		});
	}
}
