import type { ProjectPreview } from '$models/project';
import type { User } from '$models/user';

export class UserImpl implements User {
	id: string;
	name: string;
	email: string;
	version: number;
	profileImage?: string;
	teams: string[];
	projectPreviews?: ProjectPreview[];
	sharedProjectPreviews?: ProjectPreview[];

	constructor({
		id,
		name,
		email,
		version,
		profileImage,
		teams,
		projectPreviews,
		sharedProjectPreviews
	}: User) {
		this.id = id;
		this.name = name;
		this.email = email;
		this.profileImage = profileImage;
		this.teams = teams;
		this.version = version;
		this.projectPreviews = projectPreviews;
		this.sharedProjectPreviews = sharedProjectPreviews;
	}
}
