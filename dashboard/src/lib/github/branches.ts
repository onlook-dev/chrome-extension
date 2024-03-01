import type { Octokit } from "@octokit/core";

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
