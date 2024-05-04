import type { GithubRepo } from "$shared/models";
import { getOctokitByInstallationId, type CustomOctokit } from "./octokit";

export const getReposByInstallation = async (installationId: string): Promise<{ repos: GithubRepo[] }> => {
  const octokit: CustomOctokit = await getOctokitByInstallationId(installationId);

  const response = await octokit.rest.apps.listReposAccessibleToInstallation({
    installation_id: parseInt(installationId)
  });

  const repos: GithubRepo[] = response.data.repositories.map((repo) => ({
    id: repo.id.toString(),
    name: repo.name,
    owner: repo.owner.login,
  }));

  return { repos };
};

export async function getRepoDefaults(
  installationId: string,
  repo: GithubRepo
): Promise<string | undefined> {
  const octokit: CustomOctokit = await getOctokitByInstallationId(installationId);

  const repoSettings = await octokit.rest.repos.get({
    owner: repo.owner,
    repo: repo.name
  });

  const defaultBranch = repoSettings.data.default_branch;
  if (!defaultBranch) console.error(`No default branch found for ${repo.owner}/${repo.name}`);
  return defaultBranch;
}

