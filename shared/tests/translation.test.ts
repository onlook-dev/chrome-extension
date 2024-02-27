import { expect, test, describe, beforeEach } from 'bun:test';
import type { Activity } from '../models/activity';
import type { TranslationInput } from '../models/translation';
import { activityToTranslationInput, } from '../translation';

describe('translation', () => {
  const PATH = 'path/to/file';
  const START_LINE = '1';
  const END_LINE = '10';
  const FULL_PATH = `${PATH}:${START_LINE}:${END_LINE}`;
  const SELECTOR = 'unique-selector'
  const PROJECT_ID = '1';
  const CURRENT_VALUE = '';

  const ACTIVITY: Activity = {
    id: '1',
    userId: '1',
    createdAt: '2021-01-01T00:00:00Z',
    path: FULL_PATH,
    selector: SELECTOR,
    projectId: PROJECT_ID,
    eventData: [],
    visible: true,
    styleChanges: {
      color: {
        key: 'color',
        oldVal: 'red',
        newVal: 'blue'
      },
      backgroundColor: {
        key: 'backgroundColor',
        oldVal: 'yellow',
        newVal: 'black'
      }
    }
  };

  const TRANSLATION_INPUT: TranslationInput = {
    path: PATH,
    selector: SELECTOR,
    newValues: ['color: blue', 'backgroundColor: black'],
    startLine: START_LINE,
    endLine: END_LINE,
    currentValue: CURRENT_VALUE
  }

  test('should translate from activity to changes', async () => {
    const newTranslationInput = activityToTranslationInput(ACTIVITY);
    expect(newTranslationInput).toEqual(TRANSLATION_INPUT);
  });
});
