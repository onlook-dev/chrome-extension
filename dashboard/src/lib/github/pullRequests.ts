import type { CustomOctokit } from "./octokit";

export async function createOrGetPullRequest(
  octokit: CustomOctokit,
  owner: string,
  repositoryName: string,
  baseBranch: string,
  title: string,
  description: string,
  newBranch: string,
): Promise<{ pullRequestNumber: number, pullRequestUrl: string }> {
  // Check if a PR already exists
  const existingPRs = await octokit.rest.pulls.list({
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
    const pullRequest = await octokit.rest.pulls.create({
      owner,
      repo: repositoryName,
      title,
      body: description,
      head: `${owner}:${newBranch}`, // Ensure to include the owner prefix if it's a cross-repo PR
      base: baseBranch
    });

    pullRequestNumber = pullRequest.data.number;
    pullRequestUrl = pullRequest.data.html_url;
  }

  return {
    pullRequestNumber,
    pullRequestUrl
  };
}