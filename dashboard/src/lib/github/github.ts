import { getProjectFromFirebase } from '$lib/storage/project';
import { getUserFromFirebase } from '$lib/storage/user';
import { getGithubAuthFromFirebase } from '$lib/storage/github';
import { getInstallationOctokit } from './installation';
import { createCommit, prepareCommit } from './commits';
import type { FileContentData } from '$shared/models/translation';
import { createOrGetBranch } from './branches';
import { createOrGetPullRequest } from './pullRequests';

// TODO: Should clean up if any steps fail
// - Delete branch
// - Delete PR
export async function exportToPRComments(
	userId: string,
	projectId: string,
	title: string,
	description: string
): Promise<string> {
	const user = await getUserFromFirebase(userId);

	if (!user) {
		console.error('No user found');
		return 'export failed: no user found';
	}

	const project = await getProjectFromFirebase(projectId);

	if (!user.githubAuthId && !project?.githubSettings?.auth) {
		console.error('No github auth ID found');
		throw 'export failed: no github auth ID found';
	}

	const { installationId } = await getGithubAuthFromFirebase(
		user.githubAuthId ?? (project?.githubSettings?.auth as string)
	);

	if (!project.githubSettings) {
		console.error('No github settings found for this project');
		throw 'Export failed: No github settings found for this project';
	}

	const githubSettings = project.githubSettings;
	const octokit = await getInstallationOctokit(installationId);

	const commitDetails: Map<string, FileContentData> = await prepareCommit(
		octokit,
		githubSettings.owner,
		githubSettings.repositoryName,
		githubSettings.baseBranch,
		githubSettings.rootPath,
		project.activities
	);

	if (commitDetails.size === 0) {
		console.error('No commit details found');
		throw 'Export failed: No commit details found';
	}

	console.log('prepared new commit');

	const branchName = `onlook-${projectId}`;
	const branchFound = await createOrGetBranch(
		octokit,
		githubSettings.owner,
		githubSettings.repositoryName,
		githubSettings.baseBranch,
		branchName
	);

	if (!branchFound) {
		console.error('Failed to create or fetch branch');
		throw 'Export failed: Failed to create or fetch branch';
	}

	const commitId = await createCommit(
		octokit,
		githubSettings.owner,
		githubSettings.repositoryName,
		branchName,
		Array.from(commitDetails.values()),
		user,
		title
	);

	console.log('created new commit');

	const { pullRequestNumber, pullRequestUrl } = await createOrGetPullRequest(
		octokit,
		githubSettings.owner,
		githubSettings.repositoryName,
		githubSettings.baseBranch,
		title,
		description,
		branchName
	);

	console.log('created new pr: ', pullRequestUrl);
	return pullRequestUrl;
}
