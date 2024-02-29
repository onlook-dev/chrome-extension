import { Octokit } from "@octokit/core";
import { createAppAuth } from '@octokit/auth-app';
import { githubConfig } from '$lib/utils/env';

export async function getInstallationOctokit(installationId: string) {
  const installationOctokit = new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId: githubConfig.appId,
      privateKey: githubConfig.privateKey,
      installationId: installationId
    }
  });

  return installationOctokit;
}
