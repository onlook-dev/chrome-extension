import type { Activity } from "$shared/models/activity";
import type { Octokit } from "@octokit/core";
import { getPathInfo } from "./files";
import { jsToCssProperty } from "$shared/helpers";
import { DashboardRoutes, DashboardSearchParams } from "$shared/constants";
import { baseUrl } from "$lib/utils/env";

export async function createOrGetPullRequest(
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
