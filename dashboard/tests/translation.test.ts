import { expect, test, describe, beforeEach } from 'bun:test';
import type { Activity } from '$shared/models/activity';
import type { TranslationInput } from '$shared/models/translation';

describe('translation', () => {
  const PATH = 'path/to/file';
  const SELECTOR = 'unique-selector'
  const PROJECT_ID = '1';

  const ACTIVITY: Activity = {
    id: '1',
    userId: '1',
    createdAt: '2021-01-01T00:00:00Z',
    path: PATH,
    selector: SELECTOR,
    projectId: PROJECT_ID,
    eventData: [],
    visible: true,
    styleChanges: {
      color: {
        key: 'color',
        oldVal: 'red',
        newVal: 'blue'
      }
    }
  };

  const CHANGES: TranslationInput = {
    path: PATH,
    selector: SELECTOR,
    newValues: ['blue'],
    startLine: '1',
    endLine: '1',
    currentValue: 'red'
  }

  test('should translate from activity to changes', async () => {
    const newChanges = translateActivityToChanges(ACTIVITY);
    expect(newChanges).toEqual(CHANGES);
  });

});
