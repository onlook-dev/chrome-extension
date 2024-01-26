import { Octokit } from "@octokit/core";
import { createAppAuth } from "@octokit/auth-app";
import * as functions from "firebase-functions";

const appId = process.env.GITHUB_APP_ID;
const privateKey = process.env.GITHUB_PRIVATE_KEY;

async function getInstallationOctokit(installationId: string) {
  // Decode from base64
  const decodedPrivateKey = Buffer.from(privateKey!, "base64").toString();

  const installationOctokit = new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId: appId,
      privateKey: decodedPrivateKey,
      installationId: installationId,
    },
  });

  return installationOctokit;
}

export const getReposByInstallation = functions.https.onCall(async (data) => {
  const { installationId } = data;
  const octokit = await getInstallationOctokit(installationId);

  // Get the repositories accessible to the installation

  // https://docs.github.com/en/rest/apps/installations?apiVersion=2022-11-28#list-repositories-accessible-to-the-app-installation
  const repos = await octokit.request("GET /installation/repositories", {
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  return { repos };
});
