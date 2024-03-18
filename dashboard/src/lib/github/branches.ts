import type { Octokit } from "@octokit/core";
import { Endpoints } from "@octokit/types";
import { RequestError } from "@octokit/request-error";

type GetRefResponse = Endpoints["GET /repos/{owner}/{repo}/git/ref/{ref}"]["response"];
type CreateRefResponse = Endpoints["POST /repos/{owner}/{repo}/git/refs"]["response"];

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
      const getRefResponse: GetRefResponse = await octokit.request(`GET /repos/{owner}/{repo}/git/ref/{ref}`, {
        owner,
        repo: repositoryName,
        ref: `heads/${newBranch}`
      });
      console.log('Branch already exists:', newBranch);
      return true;
    } catch (branchDoesNotExistError) {
      // If the branch does not exist, GitHub API will throw a 404 error, which is caught here.
      if (!(branchDoesNotExistError instanceof RequestError && branchDoesNotExistError.status === 404)) {
        console.error('Error checking branch existence:', branchDoesNotExistError);
        return false;
      }
    }

    // Get the latest commit SHA of the base branch if the new branch does not exist
    const baseBranchResponse: GetRefResponse = await octokit.request(`GET /repos/{owner}/{repo}/git/ref/{ref}`, {
      owner,
      repo: repositoryName,
      ref: `heads/${baseBranch}`
    });

    const latestCommitSHA = baseBranchResponse.data.object.sha;

    // Create the new branch with the latest commit SHA of the base branch
    const createRefResponse: CreateRefResponse = await octokit.request(`POST /repos/{owner}/{repo}/git/refs`, {
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