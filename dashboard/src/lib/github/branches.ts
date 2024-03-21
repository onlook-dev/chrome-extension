import { CustomOctokit } from "./octokit";

async function branchExists(
  octokit: CustomOctokit,
  owner: string,
  repo: string,
  branch: string
): Promise<boolean> {
  try {
    await octokit.rest.repos.getBranch({
      owner,
      repo,
      branch
    });
    return true;
  } catch (error: any) {
    if (error.status === 404) {
      return false;
    } else {
      throw error;
    }
  }
}

export async function createNewBranch(
  octokit: CustomOctokit,
  owner: string,
  repo: string,
  baseBranch: string,
  newBranch: string
) {
  // Get the SHA of the default branch's latest commit
  const baseBranchResponse = await octokit.rest.git.getRef({
    owner,
    repo,
    ref: `heads/${baseBranch}`
  });

  const sha = baseBranchResponse.data.object.sha;

  // Create the new branch with the latest commit SHA of the base branch
  await octokit.rest.git.createRef({
    owner,
    repo,
    ref: `refs/heads/${newBranch}`,
    sha
  });
}

export async function createOrGetBranch(
  octokit: CustomOctokit,
  owner: string,
  repo: string,
  baseBranch: string,
  newBranch: string
): Promise<void> {
  try {
    // Check if the new branch already exists
    const exists = await branchExists(octokit, owner, repo, newBranch);
    if (exists) return;

    // Create the new branch
    await createNewBranch(octokit, owner, repo, baseBranch, newBranch);
  } catch (e) {
    throw `Failed to create or get branch. ${e}`;
  }
}