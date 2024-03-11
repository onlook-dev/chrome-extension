import type { GithubRepo } from "$shared/models/github";
import { getInstallationOctokit } from "./installation";

export const getReposByInstallation = async (installationId: string) => {
  const octokit = await getInstallationOctokit(installationId);

  // Get the repositories accessible to the installation
  console.log('Getting repositories...');

  // https://docs.github.com/en/rest/apps/installations?apiVersion=2022-11-28#list-repositories-accessible-to-the-app-installation
  const response = await octokit.request('GET /installation/repositories', {
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  });

  const repos = response.data.repositories.map((repo) => {
    return {
      id: repo.id,
      name: repo.name,
      owner: repo.owner.login
    };
  });

  return { repos };
};


export async function getRepoDefaults(
  installationId: string,
  repo: GithubRepo
): Promise<string | null> {
  const octokit = await getInstallationOctokit(installationId);

  try {
    const repoSettings = await octokit.request('GET /repos/{owner}/{repo}', {
      owner: repo.owner,
      repo: repo.name
    });

    const defaultBranch = repoSettings.data.default_branch;
    console.log('defaultBranch:', defaultBranch);

    if (!defaultBranch) {
      return null;
    }

    return defaultBranch;
  } catch (error) {
    console.error('Error fetching repository details:', error);
    return null;
  }
}
