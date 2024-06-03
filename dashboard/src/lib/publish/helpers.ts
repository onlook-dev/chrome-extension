import type { ProcessedActivity, TemplateNode, Activity } from "$shared/models";
// @ts-ignore
import { decompress } from '@onlook/helpers';

export function getProcessedActivities(
  activities: Record<string, Activity>,
  rootPath: string
): ProcessedActivity[] {
  const processed = Object.values(activities)
    .map((activity) => {
      if (!activity.path) return null;
      const node: TemplateNode = decompress(activity.path)
      node.path = emptyRoot(rootPath)
        ? `${node.path}`
        : `${rootPath}/${node.path}`

      return {
        activity,
        node
      } as ProcessedActivity;
    })
    .filter((activity): activity is ProcessedActivity => activity !== null);
  return processed
};

export const getExtensionFromPath = (path: string) => {
  return path.split('.').pop() ?? 'html';
};

const emptyRoot = (root: string) => root === '.' || root === '' || root === '/'
