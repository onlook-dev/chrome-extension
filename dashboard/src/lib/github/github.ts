import { getProjectFromFirebase } from '$lib/storage/project';
import { getUserFromFirebase } from '$lib/storage/user';
import { Octokit } from '@octokit/core';
import { getGithubAuthFromFirebase } from '$lib/storage/github';
import type { Activity } from '$shared/models/activity';
import { baseUrl, } from '$lib/utils/env';
import { jsToCssProperty } from '$shared/helpers';
import { DashboardRoutes, DashboardSearchParams } from '$shared/constants';
import { getInstallationOctokit } from './installation';
import { createCommit, prepareCommit } from './commits';
import { getPathInfo, type FileContentData } from './files';

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

	if (!user.githubAuthId) {
		console.error('No github auth ID found for this user');
		throw 'export failed: no github auth ID found for this user';
	}

	const { installationId } = await getGithubAuthFromFirebase(user.githubAuthId);

	const project = await getProjectFromFirebase(projectId);

	if (!project.githubSettings) {
		console.error('No github settings found for this project');
		throw 'Export failed: No github settings found for this project';
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
		throw 'Export failed: Failed to create a new branch';
	}

	console.log('created new branch: ', branchName);

	const commitDetails: Map<string, FileContentData> = await prepareCommit(
		octokit,
		githubSettings.owner,
		githubSettings.repositoryName,
		branchName,
		githubSettings.rootPath,
		project.activities
	);

	console.log('prepared new commit');

	const commitId = await createCommit(
		octokit,
		githubSettings.owner,
		githubSettings.repositoryName,
		branchName,
		Array.from(commitDetails.values())
	);

	console.log('created new commit');

	const prLink = await createPRWithComments(
		project.activities,
		projectId,
		githubSettings.owner,
		githubSettings.repositoryName,
		githubSettings.baseBranch,
		githubSettings.rootPath,
		title,
		description,
		branchName,
		commitId,
		octokit
	);

	console.log('created new pr: ', prLink);

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
		} = await octokit.request(`GET /repos/{owner}/{repo}/git/ref/{ref}`, {
			owner,
			repo: repositoryName,
			ref: `heads/${baseBranch}`
		});

		await octokit.request(`POST /repos/{owner}/{repo}/git/refs`, {
			owner,
			repo: repositoryName,
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
	projectId: string,
	owner: string,
	repositoryName: string,
	baseBranch: string,
	rootPath: string,
	title: string,
	description: string,
	newBranch: string,
	commitId: string,
	octokit: Octokit
): Promise<string> {
	const pullRequest = await octokit.request(`POST /repos/{owner}/{repo}/pulls`, {
		owner,
		repo: repositoryName,
		title,
		body: description,
		head: newBranch,
		base: baseBranch,
		headers: {
			'X-GitHub-Api-Version': '2022-11-28'
		}
	});

	const pullRequestNumber = pullRequest.data.number;
	const pullRequestUrl = pullRequest.data.html_url;

	for (const activityKey in activities) {
		const activity = activities[activityKey];
		// TODO: will have to decrypt tag to get file:lineNumber
		if (!activity.path) {
			console.error('No path found for activity');
			continue;
		}

		const pathInfo = getPathInfo(activity.path, rootPath);
		// End line must be at least one line after the start line

		let commentBody = 'onlook changes to line below:\n```\n';
		for (const key in activity.styleChanges) {
			const change = activity.styleChanges[key];
			commentBody += `${jsToCssProperty(key)}: ${change.newVal};\n`;
		}

		commentBody += '```';

		commentBody += `\n\n[View in onlook.dev](${baseUrl}${DashboardRoutes.PROJECTS}/${projectId}?${DashboardSearchParams.ACTIVITY}=${activity.id})`;

		await octokit.request(`POST /repos/{owner}/{repo}/pulls/{pull_number}/comments`, {
			owner,
			repo: repositoryName,
			pull_number: pullRequestNumber,
			body: commentBody,
			commit_id: commitId,
			path: pathInfo.path,
			start_side: 'RIGHT',
			line: pathInfo.endLine,
			side: 'RIGHT',
			headers: {
				'X-GitHub-Api-Version': '2022-11-28'
			}
		});
	}

	return pullRequestUrl;
}
