import { CommentImpl } from './comment';
import { ChangeSetImpl } from './changeset';
import type { Project, ProjectPreview } from '$models/project';
import type { HostData } from '$models/hostData';
import type { ChangeSet } from '$models/changeset';
import type { Comment } from '$models/comment';

export class ProjectPreviewImpl implements ProjectPreview {
	id: string;
	name: string;
	teamId: string;

	constructor({ id, name, teamId }: ProjectPreview) {
		this.id = id;
		this.name = name;
		this.teamId = teamId;
	}
}

export class ProjectImpl implements Project {
	id: string;
	name: string;
	teamId: string;
	hostUrl: string;
	changeSets: ChangeSet[];
	comments: Comment[];
	hostData: HostData;
	version: number;

	constructor({ id, name, teamId, hostUrl, changeSets, comments, hostData, version }: Project) {
		this.id = id;
		this.name = name;
		this.teamId = teamId;
		this.hostUrl = hostUrl;
		this.changeSets = changeSets;
		this.comments = comments;
		this.hostData = hostData;
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
			teamId: this.teamId
		});
	}
}
