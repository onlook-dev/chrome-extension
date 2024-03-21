import { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";
import { CustomOctokit } from "./octokit";
import type { TreeItem } from '$shared/models/github';
import type { FileContentData } from '$shared/models/translation';

type GetRefResponse = RestEndpointMethodTypes["git"]["getRef"]["response"];
type CreateTreeResponse = RestEndpointMethodTypes["git"]["createTree"]["response"];
type CreateCommitResponse = RestEndpointMethodTypes["git"]["createCommit"]["response"];

export async function createCommit(
	octokit: CustomOctokit,
	owner: string,
	repo: string,
	branch: string,
	authorName: string,
	authorEmail: string,
	message: string,
	files: FileContentData[],
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
		const latestCommit: GetRefResponse = await octokit.rest.git.getRef({
			owner,
			repo,
			ref: `heads/${branch}`
		});

		const latestCommitSha = latestCommit.data.object.sha;

		// Creating a new tree in the repository
		const treeResponse: CreateTreeResponse = await octokit.rest.git.createTree({
			owner,
			repo,
			base_tree: latestCommitSha,
			tree: trees
		});

		// Creating the commit pointing to the new tree
		const commitResponse: CreateCommitResponse = await octokit.rest.git.createCommit({
			owner,
			repo,
			message,
			tree: treeResponse.data.sha,
			parents: [latestCommitSha],
			author: {
				name: authorName,
				email: authorEmail
			},
		});

		// Updating the reference of the branch to point to the new commit
		await octokit.rest.git.updateRef({
			owner,
			repo,
			ref: `heads/${branch}`,
			sha: commitResponse.data.sha
		});

		return commitResponse.data.sha;
	} catch (error) {
		console.error('Failed to create commit:', error);
		return 'failed to create commit';
	}
}
