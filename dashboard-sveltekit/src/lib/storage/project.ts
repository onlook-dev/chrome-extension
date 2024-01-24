import { getObjectFromCollection, subscribeToDocument } from '$lib/firebase/firestore';
import { FIREBASE_COLLECTION_PROJECTS } from '$shared/constants';
import type { Activity } from '$shared/models/activity';
import type { Project } from '$shared/models/project';
import { getUserFromFirebase } from './user';
import { Octokit } from '@octokit/core';

export async function getProjectFromFirebase(projectId: string): Promise<Project> {
	const projectData = await getObjectFromCollection(FIREBASE_COLLECTION_PROJECTS, projectId);
	return projectData as Project;
}

export async function subscribeToProject(
	projectId: string,
	callback: (data: Project) => void
): Promise<() => void> {
	const unsubscribe = await subscribeToDocument(FIREBASE_COLLECTION_PROJECTS, projectId, callback);
	return unsubscribe;
}

export async function exportToGithubComments(userId: string, projectId: string): Promise<void> {
	const user = await getUserFromFirebase(userId);

	// TODO: create cloud function for github auth
	const installationId = '1'; // await getGithubInstillationId(user.githubAuthId);

	const project = await getProjectFromFirebase(projectId);

	if (!project.githubSettings) {
		console.error('No github settings found for this project');
		return;
	}

	const githubSettings = project.githubSettings;

	// TODO: get access token? something like await getGithubAccessToken(instillationId)?
	const githubAccessToken = installationId;

	const octokit = new Octokit({ auth: githubAccessToken });

	const branchName = `onlook-${project.name}-${Date.now()}`;

	const newBranch = await createBranch(
		octokit,
		githubSettings.owner,
		githubSettings.repositoryName,
		githubSettings.baseBranch,
		branchName
	);

	if (!newBranch) {
		console.error('Failed to create a new branch');
		return;
	}

	createPRWithComments(
		project.activities,
		githubSettings.owner,
		githubSettings.repositoryName,
		githubSettings.baseBranch,
		branchName,
		octokit
	);
}

async function createBranch(
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

async function createPRWithComments(
	activities: Record<string, Activity>,
	owner: string,
	repositoryName: string,
	baseBranch: string,
	newBranch: string,
	octokit: Octokit
) {
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

	for (const activityKey in activities) {
		const activity = activities[activityKey];
		const [filePath, lineString] = activity.codeSelector.split(':');
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
}
