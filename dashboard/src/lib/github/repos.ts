import type { Octokit } from '@octokit/core';
import { Endpoints } from '@octokit/types';
import type { GithubRepo } from "$shared/models/github";
import { getInstallationOctokit } from "./installation";

type ListInstallationReposResponse = Endpoints["GET /installation/repositories"]["response"];
type GetRepoResponse = Endpoints["GET /repos/{owner}/{repo}"]["response"];

export const getReposByInstallation = async (installationId: string): Promise<{ repos: GithubRepo[] }> => {
  const octokit: Octokit = await getInstallationOctokit(installationId);
  console.log('Getting repositories...');

  const response: ListInstallationReposResponse = await octokit.request('GET /installation/repositories', {
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  });

  const repos: GithubRepo[] = response.data.repositories.map((repo) => ({
    id: repo.id.toString(), // Assuming your GithubRepo type expects a string for id
    name: repo.name,
    owner: repo.owner.login,
    // Include any other fields your GithubRepo type may require
  }));

  return { repos };
};

export async function getRepoDefaults(
  installationId: string,
  repo: GithubRepo
): Promise<string | null> {
  const octokit: Octokit = await getInstallationOctokit(installationId);

  try {
    const repoSettings: GetRepoResponse = await octokit.request('GET /repos/{owner}/{repo}', {
      owner: repo.owner,
      repo: repo.name
    });

    const defaultBranch = repoSettings.data.default_branch;
    console.log('defaultBranch:', defaultBranch);

    return defaultBranch || null;
  } catch (error) {
    console.error('Error fetching repository details:', error);
    return null;
  }
}
