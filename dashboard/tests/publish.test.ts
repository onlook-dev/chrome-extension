// @ts-ignore - Bun test exists
import { expect, test, describe } from 'bun:test';
import { filterActivitiesWithoutPath } from '$lib/publish/helpers';

describe('ProjectPublisher', () => {
  test('should filter activities correctly', () => {
    // Setup
    const activities = {
      act1: { path: 'path/to/activity1' },
      act2: { /* no path */ },
      act3: { path: 'path/to/activity3' },
    };

    const expected = {
      act1: { path: 'path/to/activity1' },
      act3: { path: 'path/to/activity3' },
    };

    // Execute
    const filtered = filterActivitiesWithoutPath(activities as any);

    // Assert
    expect(Object.keys(filtered).length).toBe(2);
    expect(filtered).toEqual(expected);
  });
});