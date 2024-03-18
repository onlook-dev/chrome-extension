import type { Octokit } from '@octokit/core';
import type { TreeItem } from '$shared/models/github';
import type { FileContentData } from '$shared/models/translation';
import type { User } from '$shared/models/user';

import { Endpoints } from '@octokit/types';

type GetRefResponse = Endpoints["GET /repos/{owner}/{repo}/git/ref/{ref}"]["response"];
type CreateTreeResponse = Endpoints["POST /repos/{owner}/{repo}/git/trees"]["response"];
type CreateCommitResponse = Endpoints["POST /repos/{owner}/{repo}/git/commits"]["response"];


export async function createCommit(
	octokit: Octokit,
	owner: string,
	repo: string,
	branch: string,
	files: FileContentData[],
	user: User,
	title: string
): Promise<string> {
	try {
		// Preparing the tree for the commit
		const trees: TreeItem[] = files.map((file) => ({
			path: file.path,
			mode: '100644', // file mode for a blob (file content)
			type: 'blob', // specifying the type as a blob (file content)
			content: file.content
		}));

		// Getting the SHA of the latest commit on the branch
		const latestCommit: GetRefResponse = await octokit.request('GET /repos/{owner}/{repo}/git/ref/{ref}', {
			owner,
			repo,
			ref: `heads/${branch}`
		});
		const latestCommitSha = latestCommit.data.object.sha;

		// Creating a new tree in the repository
		const treeResponse: CreateTreeResponse = await octokit.request('POST /repos/{owner}/{repo}/git/trees', {
			owner,
			repo,
			tree: trees,
			base_tree: latestCommitSha // Use the latest commit SHA as the base tree
		});

		// Creating the commit pointing to the new tree
		const commitResponse: CreateCommitResponse = await octokit.request('POST /repos/{owner}/{repo}/git/commits', {
			owner,
			repo,
			message: title,
			tree: treeResponse.data.sha,
			parents: [latestCommitSha],
			author: {
				name: user.name,
				email: user.email,
				date: new Date().toISOString()
			},
			headers: {
				'X-GitHub-Api-Version': '2022-11-28'
			}
		});

		// Updating the reference of the branch to point to the new commit
		await octokit.request('PATCH /repos/{owner}/{repo}/git/refs/heads/{branch}', {
			owner,
			repo,
			sha: commitResponse.data.sha,
			branch
		});

		return commitResponse.data.sha;
	} catch (error) {
		console.error('Failed to create commit:', error);
		return 'failed to create commit';
	}
}
