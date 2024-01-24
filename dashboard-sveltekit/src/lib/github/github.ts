import { getProjectFromFirebase } from '$lib/storage/project';
import { getUserFromFirebase } from '$lib/storage/user';
import { Octokit } from '@octokit/core';
import { createAppAuth } from '@octokit/auth-app';
import { getGithubAuthFromFirebase } from '$lib/storage/github';
import type { Activity } from '$shared/models/activity';
import { githubConfig } from '$lib/utils/env';

export async function exportToPRComments(userId: string, projectId: string): Promise<string> {
	const user = await getUserFromFirebase(userId);

	if (!user) {
		console.error('No user found');
		return 'export failed: no user found';
	}

	if (!user.githubAuthId) {
		console.error('No github auth ID found for this user');
		return 'export failed: no github auth ID found for this user';
	}

	const { installationId } = await getGithubAuthFromFirebase(user.githubAuthId);

	const project = await getProjectFromFirebase(projectId);

	if (!project.githubSettings) {
		console.error('No github settings found for this project');
		return 'export failed: no github settings found for this project';
	}

	const githubSettings = project.githubSettings;

	const octokit = await getInstallationOctokit(installationId);

	const branchName = `onlook-${Date.now()}`;

	const newBranch = await createBranch(
		octokit,
		githubSettings.owner,
		githubSettings.repositoryName,
		githubSettings.baseBranch,
		branchName
	);

	if (!newBranch) {
		console.error('Failed to create a new branch');
		return 'export failed: failed to create a new branch';
	}

	const prLink = await createPRWithComments(
		project.activities,
		githubSettings.owner,
		githubSettings.repositoryName,
		githubSettings.baseBranch,
		branchName,
		octokit
	);

	return prLink;
}

export async function createBranch(
	octokit: Octokit,
	owner: string,
	repositoryName: string,
	baseBranch: string,
	newBranch: string
): Promise<boolean> {
	try {
		const {
			data: {
				object: { sha: latestCommitSHA }
			}
		} = await octokit.request(`GET /repos/${owner}/${repositoryName}/git/ref/heads/${baseBranch}`);

		await octokit.request(`POST /repos/${owner}/${repositoryName}/git/refs`, {
			owner,
			repositoryName,
			ref: `refs/heads/${newBranch}`,
			sha: latestCommitSHA
		});

		return true;
	} catch (error) {
		console.error('Failed to create new branch:', error);
		return false;
	}
}

export async function createPRWithComments(
	activities: Record<string, Activity>,
	owner: string,
	repositoryName: string,
	baseBranch: string,
	newBranch: string,
	octokit: Octokit
): Promise<string> {
	const pullRequest = await octokit.request(`POST /repos/${owner}/${repositoryName}/pulls`, {
		owner,
		repositoryName,
		title: 'Onlook Style Updates',
		body: 'onlook style updates',
		head: newBranch,
		base: baseBranch,
		headers: {
			'X-GitHub-Api-Version': '2022-11-28'
		}
	});

	const pullRequestNumber = pullRequest.data.number;
	const pullRequestUrl = pullRequest.data.html_url;

	// TODO: determine if we enable selective exporting of activities
	// TODO: determine if we archive activies for a project after they are exported
	for (const activityKey in activities) {
		const activity = activities[activityKey];
		// TODO: will have to decrypt tag to get file:lineNumber
		const [filePath, lineString] = activity.onlookTag.split(':');
		const lineNumber = parseInt(lineString);

		let commentBody = 'onlook changes:\n';
		for (const key in activity.styleChanges) {
			const change = activity.styleChanges[key];
			commentBody += `\`${key}: ${change.newVal};\` (was \`${change.oldVal}\`)\n`;
		}

		await octokit.request(
			`POST /repos/${owner}/${repositoryName}/pulls/${pullRequestNumber}/comments`,
			{
				owner,
				repositoryName,
				pull_number: pullRequestNumber,
				body: commentBody,
				commit_id: newBranch, // using latest commit SHA in the new branch
				path: filePath,
				start_line: lineNumber,
				start_side: 'RIGHT',
				line: lineNumber,
				side: 'RIGHT',
				headers: {
					'X-GitHub-Api-Version': '2022-11-28'
				}
			}
		);
	}

	return pullRequestUrl;
}

async function getInstallationOctokit(installationId: string) {
	const installationOctokit = new Octokit({
		authStrategy: createAppAuth,
		auth: {
			appId: githubConfig.appId,
			privateKey: githubConfig.privateKey,
			installationId: installationId
		}
	});

	return installationOctokit;
}
