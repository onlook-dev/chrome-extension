import { createAppAuth } from '@octokit/auth-app';
import { githubConfig } from '$lib/utils/env';
import { CustomOctokit } from './octokit';

export function getInstallationOctokit(installationId: string) {
  const octokit = new CustomOctokit({
    authStrategy: createAppAuth,
    auth: {
      appId: githubConfig.appId,
      privateKey: githubConfig.privateKey,
      installationId: installationId
    }
  });

  return octokit;
}
