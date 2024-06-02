// @ts-ignore - Bun test exists
import { expect, test, describe } from 'bun:test';
import { getProcessedActivities } from '$lib/publish/helpers';
import { StyleTranslationInput, TextTranslationInput, ProcessedActivity } from '$shared/models/translation';
import { getStyleTranslationInput, getTextTranslationInput } from '$lib/publish/inputs';

describe('ProjectPublisher helpers', () => {
  test('should get processed activity', () => {
    // Setup
    const rootPath = 'root';
    const activities = {
      act1: { path: 'path/to/activity1.html:1:2:3' } as any,
      act2: { /* no path */ } as any,
      act3: { path: 'path/to/activity3.jsx:1:2:3' } as any,
    };

    const expected: ProcessedActivity[] = [
      { activity: activities.act1, node: { path: 'root/path/to/activity1.html', startLine: 1, startTagEndLine: 2, endLine: 3, extension: 'html' } },
      { activity: activities.act3, node: { path: 'root/path/to/activity3.jsx', startLine: 1, startTagEndLine: 2, endLine: 3, extension: 'jsx' } }
    ];

    // Execute
    const processed = getProcessedActivities(activities as any, rootPath);

    // Assert
    expect(processed).toEqual(expected);
  });

  test('should get style translation input', () => {
    // Setup
    const content = `<div>
      <p>Some text here</p>
    </div>
  `;
    const pathInfo: PathInfo = {
      path: 'root/path/to/activity1.html',
      startLine: 1,
      startTagEndLine: 1,
      endLine: 3,
      extension: 'html'
    };

    const activity = {
      styleChanges: {
        color: { key: 'color', newVal: 'red', oldVal: 'black' },
        backgroundColor: { key: 'background-color', newVal: 'blue', oldVal: 'white' }
      },
      attributeChanges: {
        full: { key: 'full', newVal: 'custom mt-8', oldVal: 'custom mt-4' },
        updated: { key: 'updated', newVal: 'mt-8', oldVal: 'mt-4' }
      }
    } as any;

    const expected: StyleTranslationInput = {
      framework: 'html',
      css: 'color: red; background-color: blue',
      code: '<div>',
      tailwind: 'mt-8'
    };

    // Execute
    const translationInput = getStyleTranslationInput(content, pathInfo, activity);

    // Assert
    expect(translationInput).toEqual(expected);
  });

  test('should get text translation input', () => {
    // Setup
    const content = `<div>
      <p>Some text here</p>
    </div>
  `;
    const pathInfo: PathInfo = {
      path: 'root/path/to/activity1.html',
      startLine: 1,
      startTagEndLine: 2,
      endLine: 3,
      extension: 'html'
    };

    const activity = {
      textChanges: {
        text: { newVal: 'New text', oldVal: 'Old text' },
      }
    } as any;

    const expected: TextTranslationInput = {
      framework: 'html',
      oldText: 'Old text',
      newText: 'New text',
      code: `<div>
      <p>Some text here</p>
    </div>`
    };

    // Execute
    const translationInput = getTextTranslationInput(content, pathInfo, activity);

    // Assert
    expect(translationInput).toEqual(expected);
  });

  test('text translation should throw if no text changes', () => {
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
      extension: 'html'
    };

    const activity = {
      styleChanges: {
        color: { key: 'color', newVal: 'red', oldVal: 'black' },
        backgroundColor: { key: 'background-color', newVal: 'blue', oldVal: 'white' }
      }
    } as any;


    // Execute
    // Assert
    expect(async () => {
      await getTextTranslationInput(content, pathInfo, activity)
    }).toThrow();
  });

});