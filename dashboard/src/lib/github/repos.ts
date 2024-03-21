import { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";
import { getInstallationOctokit } from "./installation";
import type { GithubRepo } from "$shared/models/github";
import type { CustomOctokit } from "./octokit";

type ListInstallationReposResponse = RestEndpointMethodTypes["apps"]["listReposAccessibleToInstallation"]["response"];
type GetRepoResponse = RestEndpointMethodTypes["repos"]["get"]["response"];

export const getReposByInstallation = async (installationId: string): Promise<{ repos: GithubRepo[] }> => {
  const octokit: CustomOctokit = await getInstallationOctokit(installationId);

  const response: ListInstallationReposResponse = await octokit.rest.apps.listReposAccessibleToInstallation({
    installation_id: parseInt(installationId),
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
  const octokit: CustomOctokit = await getInstallationOctokit(installationId);

  try {
    const repoSettings: GetRepoResponse = await octokit.rest.repos.get({
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
