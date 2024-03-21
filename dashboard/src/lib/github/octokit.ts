import { Octokit } from "@octokit/core";
import { retry } from '@octokit/plugin-retry';
import { throttling } from "@octokit/plugin-throttling";
import { restEndpointMethods } from "@octokit/plugin-rest-endpoint-methods";

export const CustomOctokit = Octokit
  .plugin(retry)
  .plugin(throttling)
  .plugin(restEndpointMethods);

export type CustomOctokit = InstanceType<typeof CustomOctokit>;