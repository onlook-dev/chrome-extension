import { Octokit } from "@octokit/core";
import { retry } from '@octokit/plugin-retry';
import { throttling } from "@octokit/plugin-throttling";
import { restEndpointMethods } from "@octokit/plugin-rest-endpoint-methods";
import { createAppAuth } from '@octokit/auth-app';
import { githubConfig } from '$lib/utils/env';

export const CustomOctokit = Octokit
  .plugin(retry)
  .plugin(throttling)
  .plugin(restEndpointMethods);

export type CustomOctokit = InstanceType<typeof CustomOctokit>;


export function getOctokitByInstallationId(installationId: string) {
  const octokit = new CustomOctokit({
    authStrategy: createAppAuth,
    auth: {
      appId: githubConfig.appId,
      privateKey: githubConfig.privateKey,
      installationId: installationId
    },
    throttle: {
      onRateLimit: (retryAfter, options, octokit, retryCount) => {
        octokit.log.warn(
          `Request quota exhausted for request ${options.method} ${options.url}`,
        );

        if (retryCount < 1) {
          // only retries once
          octokit.log.info(`Retrying after ${retryAfter} seconds!`);
          return true;
        }
      },
      onSecondaryRateLimit: (retryAfter, options, octokit) => {
        // does not retry, only logs a warning
        octokit.log.warn(
          `SecondaryRateLimit detected for request ${options.method} ${options.url}`,
        );
      },
    },
  });

  return octokit;
}
