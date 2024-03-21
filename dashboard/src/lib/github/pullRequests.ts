import type { CustomOctokit } from "./octokit";

export async function createOrGetPullRequest(
  octokit: CustomOctokit,
  owner: string,
  repositoryName: string,
  baseBranch: string,
  title: string,
  description: string,
  newBranch: string,
): Promise<string> {
  // Check if a PR already exists
  const existingPRs = await octokit.rest.pulls.list({
    owner,
    repo: repositoryName,
    head: `${owner}:${newBranch}`,
    base: baseBranch
  });
  if (existingPRs.data.length > 0) {
    return existingPRs.data[0].html_url;
  } else {
    // Create a new PR
    const pr = await octokit.rest.pulls.create({
      owner,
      repo: repositoryName,
      title,
      body: description,
      head: `${owner}:${newBranch}`, // Ensure to include the owner prefix if it's a cross-repo PR
      base: baseBranch
    })
    return pr.data.html_url;
  }

}