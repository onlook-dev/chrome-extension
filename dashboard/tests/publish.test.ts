// @ts-ignore - Bun test exists
import { expect, test, describe } from 'bun:test';
import { getProcessedActivities } from '$lib/publish/helpers';

describe('ProjectPublisher helpers', () => {
  test('should get processed activity', () => {
    // Setup
    const rootPath = 'root';
    const activities = {
      act1: { path: 'path/to/activity1:1:2:3' },
      act2: { /* no path */ },
      act3: { path: 'path/to/activity3:1:2:3' },
    };

    const expected = [
      { activity: activities.act1, pathInfo: { path: 'root/path/to/activity1', startLine: 1, startTagEndLine: 2, endLine: 3 } },
      { activity: activities.act3, pathInfo: { path: 'root/path/to/activity3', startLine: 1, startTagEndLine: 2, endLine: 3 } }
    ]

    // Execute
    const processed = getProcessedActivities(activities as any, rootPath);

    // Assert
    expect(processed).toEqual(expected);
  });
});