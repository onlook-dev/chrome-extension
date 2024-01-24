import { Octokit } from "@octokit/core";
import { createAppAuth } from "@octokit/auth-app";

const appId = process.env.GITHUB_APP_ID;
const privateKey = process.env.GITHUB_PRIVATE_KEY;

async function getInstallationOctokit(installationId: string) {
  console.log("Getting installation octokit...");
  const appOctokit = new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId,
      privateKey,
      installationId,
    },
  });

  const installationResponse: any = await appOctokit.auth({
    type: "installation",
  });

  return new Octokit({
    auth: installationResponse.token,
  });
}

export const getRepositoriesFromInstallation = async (
  installationId: string
) => {
  const octokit = await getInstallationOctokit(installationId);

  // Get the repositories accessible to the installation
  console.log("Getting user repositories...");
  const reposResponse = await octokit.request(
    `GET /user/installations/${installationId}/repositories`,
    {
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  const repos = reposResponse.data.repositories.map((repo: any) => repo.id);
  console.log("Repos:", repos.length);
  return { repos };
};
