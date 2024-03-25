// @ts-ignore - Bun test exists
import { expect, test, describe } from 'bun:test';
import { getProcessedActivities, getTranslationInput } from '$lib/publish/helpers';
import { PathInfo, TranslationInput } from '$shared/models/translation';

describe('ProjectPublisher helpers', () => {
  test('should get processed activity', () => {
    // Setup
    const rootPath = 'root';
    const activities = {
      act1: { path: 'path/to/activity1.html:1:2:3' },
      act2: { /* no path */ },
      act3: { path: 'path/to/activity3.jsx:1:2:3' },
    };

    const expected = [
      { activity: activities.act1, pathInfo: { path: 'root/path/to/activity1.html', startLine: 1, startTagEndLine: 2, endLine: 3 } },
      { activity: activities.act3, pathInfo: { path: 'root/path/to/activity3.jsx', startLine: 1, startTagEndLine: 2, endLine: 3 } }
    ]

    // Execute
    const processed = getProcessedActivities(activities as any, rootPath);

    // Assert
    expect(processed).toEqual(expected);
  });

  // TODO: Add failure cases
  test('should get translation input', () => {
    // Setup
    const content = `<div>
      <p>Some text here</p>
    </div>
  `;
    const pathInfo: PathInfo = {
      path: 'root/path/to/activity1.html',
      startLine: 2,
      startTagEndLine: 2,
      endLine: 2,
    };

    const activity = {
      styleChanges: {
        color: { key: 'color', newVal: 'red', oldVal: 'black' },
        backgroundColor: { key: 'background-color', newVal: 'blue', oldVal: 'white' }
      }
    } as any;

    const expected: TranslationInput = {
      framework: 'html',
      css: 'color: red; background-color: blue',
      code: '      <p>Some text here</p>'
    };

    // Execute
    const translationInput = getTranslationInput(content, pathInfo, activity);

    // Assert
    expect(translationInput).toEqual(expected);
  });
});