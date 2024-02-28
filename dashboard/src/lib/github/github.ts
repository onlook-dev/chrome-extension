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

	const { pullRequestNumber, pullRequestUrl } = await createPullRequest(
		octokit,
		githubSettings.owner,
		githubSettings.repositoryName,
		githubSettings.baseBranch,
		title,
		description,
		branchName
	);

	console.log('created new pr: ', pullRequestUrl);

	// TODO: Add PR comments
	// await createPullRequestComments(
	// 	githubSettings.owner,
	// 	githubSettings.repositoryName,
	// 	pullRequestNumber,
	// 	githubSettings.rootPath,
	// 	description,
	// 	octokit
	// );

	return pullRequestUrl;
}

export async function createOrGetBranch(
	octokit: Octokit,
	owner: string,
	repositoryName: string,
	baseBranch: string,
	newBranch: string
): Promise<boolean> {
	try {
		// Check if the new branch already exists
		try {
			await octokit.request(`GET /repos/{owner}/{repo}/git/ref/{ref}`, {
				owner,
				repo: repositoryName,
				ref: `heads/${newBranch}`
			});
			// If the request succeeds, the branch exists, no need to create it.
			console.log('Branch already exists:', newBranch);
			return true;
		} catch (branchDoesNotExistError) {
			// If the branch does not exist, GitHub API will throw an error.
		}

		// Get the latest commit SHA of the base branch if the new branch does not exist
		const {
			data: {
				object: { sha: latestCommitSHA }
			}
		} = await octokit.request(`GET /repos/{owner}/{repo}/git/ref/{ref}`, {
			owner,
			repo: repositoryName,
			ref: `heads/${baseBranch}`
		});

		// Create the new branch with the latest commit SHA of the base branch
		await octokit.request(`POST /repos/{owner}/{repo}/git/refs`, {
			owner,
			repo: repositoryName,
			ref: `refs/heads/${newBranch}`,
			sha: latestCommitSHA
		});

		console.log('Branch created:', newBranch);
		return true;
	} catch (error) {
		console.error('Failed to create or get branch:', error);
		return false;
	}
}

export async function createPullRequest(
	octokit: Octokit,
	owner: string,
	repositoryName: string,
	baseBranch: string,
	title: string,
	description: string,
	newBranch: string,
): Promise<{ pullRequestNumber: number, pullRequestUrl: string }> {
	// Check if a PR already exists
	const existingPRs = await octokit.request(`GET /repos/{owner}/{repo}/pulls`, {
		owner,
		repo: repositoryName,
		head: `${owner}:${newBranch}`,
		base: baseBranch
	});

	let pullRequestNumber: number;
	let pullRequestUrl: string;

	if (existingPRs.data.length > 0) {
		// PR already exists, use the first one
		pullRequestNumber = existingPRs.data[0].number;
		pullRequestUrl = existingPRs.data[0].html_url;
	} else {
		// Create a new PR
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

		pullRequestNumber = pullRequest.data.number;
		pullRequestUrl = pullRequest.data.html_url;
	}

	return {
		pullRequestNumber,
		pullRequestUrl
	};
}


export async function createPullRequestComments(
	activities: Record<string, Activity>,
	projectId: string,
	owner: string,
	repositoryName: string,
	pullRequestNumber: number,
	rootPath: string,
	octokit: Octokit,
	commitId: string
): Promise<void> {
	// Add comments to the PR for each activity
	// Retrieve existing PR comments
	const existingComments = await octokit.request(`GET /repos/{owner}/{repo}/pulls/{pull_number}/comments`, {
		owner,
		repo: repositoryName,
		pull_number: pullRequestNumber,
	});

	for (const activityKey in activities) {
		const activity = activities[activityKey];
		if (!activity.path) {
			console.error('No path found for activity');
			continue;
		}

		const pathInfo = getPathInfo(activity.path, rootPath);
		let commentBody = 'CSS changes to line below:\n```\n';
		for (const key in activity.styleChanges) {
			const change = activity.styleChanges[key];
			commentBody += `${jsToCssProperty(key)}: ${change.newVal};\n`;
		}
		commentBody += '```';
		commentBody += `\n\n[View in onlook](${baseUrl}${DashboardRoutes.PROJECTS}/${projectId}?${DashboardSearchParams.ACTIVITY}=${activity.id})`;

		// Check if a comment already exists for this line
		const existingComment = existingComments.data.find(comment => comment.path === pathInfo.path && comment.position === pathInfo.endLine);

		if (existingComment && existingComment.body !== commentBody) {
			// Update existing comment if content is different
			await octokit.request(`PATCH /repos/{owner}/{repo}/pulls/comments/{comment_id}`, {
				owner,
				repo: repositoryName,
				comment_id: existingComment.id,
				body: commentBody,
			});
		} else if (!existingComment) {
			// Create a new comment if none exists for this line
			await octokit.request(`POST /repos/{owner}/{repo}/pulls/{pull_number}/comments`, {
				owner,
				repo: repositoryName,
				pull_number: pullRequestNumber,
				body: commentBody,
				commit_id: commitId,
				path: pathInfo.path,
				line: pathInfo.endLine,
				side: 'RIGHT',
			});
		}
	}

}
