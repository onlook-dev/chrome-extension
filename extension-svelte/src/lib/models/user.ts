import type { ProjectPreviewImpl } from './project';

interface User {
	id: string;
	name: string;
	email: string;
	version: number;
	profileImage?: string;
	projectIds: string[];

	// TODO: implement after v1.2.2
	projectPreviews?: ProjectPreviewImpl[];
	sharedProjectPreviews?: ProjectPreviewImpl[];
}

export class UserImpl implements User {
	id: string;
	name: string;
	email: string;
	profileImage?: string | undefined;
	projectIds: string[];
	version: number;

	// TODO: implement after v1.2.2
	projectPreviews: ProjectPreviewImpl[];
	sharedProjectPreviews: ProjectPreviewImpl[];

	constructor({
		id,
		name,
		email,
		profileImage,
		projectIds,
		version,
		projectPreviews,
		sharedProjectPreviews
	}: User) {
		this.id = id;
		this.name = name;
		this.email = email;
		this.profileImage = profileImage;
		this.projectIds = projectIds;
		this.version = version;
		// TODO: implement after v1.2.2
		this.projectPreviews = projectPreviews || [];
		this.sharedProjectPreviews = sharedProjectPreviews || [];
	}
}
