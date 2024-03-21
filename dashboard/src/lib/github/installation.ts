import { Octokit } from "@octokit/core";
import { createAppAuth } from '@octokit/auth-app';
import { githubConfig } from '$lib/utils/env';
import { retry } from '@octokit/plugin-retry';
import { throttling } from "@octokit/plugin-throttling";
import { restEndpointMethods } from "@octokit/plugin-rest-endpoint-methods";

export function getInstallationOctokit(installationId: string) {
  const CustomOctokit = Octokit
    .plugin(retry)
    .plugin(throttling)
    .plugin(restEndpointMethods);

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
