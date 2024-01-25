import { getProjectFromFirebase } from '$lib/storage/project';
import { getUserFromFirebase } from '$lib/storage/user';
import { Octokit } from '@octokit/core';
import { createAppAuth } from '@octokit/auth-app';
import { getGithubAuthFromFirebase } from '$lib/storage/github';
import type { Activity } from '$shared/models/activity';
import { githubConfig } from '$lib/utils/env';
import type { TreeItem } from '$shared/models/github';

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

	console.log('created new branch: ', branchName);

	const commitDetails = await prepareCommit(
		octokit,
		githubSettings.owner,
		githubSettings.repositoryName,
		branchName,
		project.activities
	);

	console.log('prepared new commit');

	const commitId = await createCommit(
		octokit,
		githubSettings.owner,
		githubSettings.repositoryName,
		branchName,
		commitDetails
	);

	console.log('created new commit');

	const prLink = await createPRWithComments(
		project.activities,
		githubSettings.owner,
		githubSettings.repositoryName,
		githubSettings.baseBranch,
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
	owner: string,
	repositoryName: string,
	baseBranch: string,
	newBranch: string,
	commitId: string,
	octokit: Octokit
): Promise<string> {
	const pullRequest = await octokit.request(`POST /repos/{owner}/{repo}/pulls`, {
		owner,
		repo: repositoryName,
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
		const [filePath, lineString] = activity.path.split(':');

		const lineNumber = parseInt(lineString);

		let commentBody = 'onlook changes:\n';
		for (const key in activity.styleChanges) {
			const change = activity.styleChanges[key];
			commentBody += `\`${key}: ${change.newVal};\` (was \`${change.oldVal}\`)\n`;
		}

		await octokit.request(`POST /repos/{owner}/{repo}/pulls/{pull_number}/comments`, {
			owner,
			repo: repositoryName,
			pull_number: pullRequestNumber,
			body: commentBody,
			commit_id: commitId,
			path: filePath,
			start_line: lineNumber,
			start_side: 'RIGHT',
			line: lineNumber + 1,
			side: 'RIGHT',
			headers: {
				'X-GitHub-Api-Version': '2022-11-28'
			}
		});
	}

	return pullRequestUrl;
}

// Create a comment on each file that has onlook edits
async function prepareCommit(
	octokit: Octokit,
	owner: string,
	repo: string,
	branch: string,
	activities: Record<string, Activity>
): Promise<{ path: string; content: string; sha: string }[]> {
	const fileEdits = new Map<string, number[]>();

	for (const activityKey in activities) {
		const [filePath, lineNumberString] = activities[activityKey].path.split(':');
		const lineNumber = parseInt(lineNumberString);
		if (!fileEdits.has(filePath)) {
			fileEdits.set(filePath, []);
		}
		fileEdits.get(filePath)?.push(lineNumber);
	}

	const filesToUpdate = await Promise.all(
		Array.from(fileEdits).map(async ([filePath, lineNumbers]) => {
			try {
				const contentResponse = await octokit.request(
					`GET /repos/${owner}/${repo}/contents/${filePath}?ref=${branch}`,
					{ owner, repo, path: filePath }
				);

				let content = atob(contentResponse.data.content);
				let contentLines = content.split('\n');

				lineNumbers.sort((a, b) => b - a); // Sort line numbers in descending order

				for (const lineNumber of lineNumbers) {
					if (lineNumber <= contentLines.length) {
						contentLines.splice(lineNumber - 1, 0, '// onlook edits');
					}
				}

				const newContent = contentLines.join('\n');

				return {
					path: filePath,
					content: newContent,
					sha: contentResponse.data.sha
				};
			} catch (error) {
				console.error(`Failed to fetch content for ${filePath}:`, error);
				return null;
			}
		})
	);

	return filesToUpdate.filter(
		(file): file is { path: string; content: string; sha: string } => file !== null
	);
}

async function createCommit(
	octokit: Octokit,
	owner: string,
	repo: string,
	branch: string,
	files: { path: string; content: string; sha: string }[]
): Promise<string> {
	try {
		// Preparing the tree for the commit
		const trees: TreeItem[] = files.map((file) => ({
			path: file.path,
			mode: '100644', // mode is explicitly typed
			type: 'blob', // type is explicitly typed
			content: file.content
		}));
		console.log('trees:', trees);

		// Getting the SHA of the latest commit on the branch
		const latestCommit = await octokit.request(`GET /repos/{owner}/{repo}/git/ref/{ref}`, {
			owner,
			repo,
			ref: `heads/${branch}`
		});
		const latestCommitSha = latestCommit.data.object.sha;

		// Creating a new tree in the repository
		const treeResponse = await octokit.request(`POST /repos/{owner}/{repo}/git/trees`, {
			owner,
			repo,
			tree: trees,
			base_tree: latestCommitSha // Use the latest commit SHA as the base tree
		});

		// Creating the commit pointing to the new tree
		const commitResponse = await octokit.request(`POST /repos/{owner}/{repo}/git/commits`, {
			owner,
			repo,
			message: 'Adding onlook comments to multiple files',
			tree: treeResponse.data.sha,
			parents: [latestCommitSha],
			author: {
				name: 'Onlook',
				email: 'erik@onlook.dev',
				date: new Date().toISOString()
			},
			headers: {
				'X-GitHub-Api-Version': '2022-11-28'
			}
		});

		// Updating the reference of the branch to point to the new commit
		await octokit.request(`PATCH /repos/{owner}/{repo}/git/refs/heads/${branch}`, {
			owner,
			repo,
			sha: commitResponse.data.sha
		});

		return commitResponse.data.sha;
	} catch (error) {
		console.error('Failed to create commit:', error);
		return 'failed to create commit';
	}
}

export const getReposByInstallation = async (installationId: string) => {
	const octokit = await getInstallationOctokit(installationId);

	// Get the repositories accessible to the installation
	console.log('Getting user repositories...');

	// https://docs.github.com/en/rest/apps/installations?apiVersion=2022-11-28#list-repositories-accessible-to-the-app-installation
	const response = await octokit.request('GET /installation/repositories', {
		headers: {
			'X-GitHub-Api-Version': '2022-11-28'
		}
	});

	const repos = response.data.repositories.map((repo: any) => {
		return {
			id: repo.id,
			name: repo.name,
			owner: repo.owner.login
		};
	});

	return { repos };
};

async function getInstallationOctokit(installationId: string) {
	console.log('Getting installation octokit...');

	const installationOctokit = new Octokit({
		authStrategy: createAppAuth,
		auth: {
			appId: githubConfig.appId,
			privateKey: githubConfig.privateKey,
			installationId: installationId
		}
	});

	console.log('Got installation octokit', installationOctokit);

	return installationOctokit;
}
