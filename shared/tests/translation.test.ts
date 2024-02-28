import { expect, test, describe, } from 'bun:test';
import type { Activity } from '../models/activity';
import type { TranslationInput } from '../models/translation';
import { activityToTranslationInput, updateContentClass, } from '../translation';

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
    newCss: ['color: blue', 'backgroundColor: black'],
    currentClasses: CURRENT_VALUE
  }

  test('should translate from activity to changes', async () => {
    const pathInfo = { path: PATH };
    const newTranslationInput = activityToTranslationInput(ACTIVITY, pathInfo, CURRENT_VALUE);
    expect(newTranslationInput).toEqual(TRANSLATION_INPUT);
  });
});


describe('edit classes', () => {
  const OLD_CLASS = 'mt-6 ml-auto';
  const NEW_CLASS = 'mt-4 ml-2';

  const CASES = [
    {
      code: `<div class="${OLD_CLASS}">`,
      expected: `<div class="${NEW_CLASS}">`
    },
    {
      code: `<div>`,
      expected: `<div class="${NEW_CLASS}">`
    },
    {
      code: `<div className="${OLD_CLASS}">`,
      expected: `<div className="${NEW_CLASS}">`
    },
    {
      code: `<div class='mt-6 ml-auto'>`,
      expected: `<div class='${NEW_CLASS}'>`
    },
    {
      code: `<div class=\`${OLD_CLASS}\`>`,
      expected: `<div class=\`${NEW_CLASS}\`>`
    },
    {
      code: `<div id="uniqueId" class="${OLD_CLASS}" data-test="test">`,
      expected: `<div id="uniqueId" class="${NEW_CLASS}" data-test="test">`
    },
    {
      code: `<div className="">`,
      expected: `<div className="${NEW_CLASS}">`
    },
  ];

  // TODO: Handle this. Might need parser like cheerio or babel
  const UNHANDLED_CASES = [
    {
      code: `<div class = "${OLD_CLASS}">`,
      expected: `<div class = "${NEW_CLASS}">`
    },
    {
      code: `<span>Some text with class="${OLD_CLASS}" in it</span>`,
      expected: `<span>Some text with class="${OLD_CLASS}" in it</span>` // No change expected
    }
  ]

  test('should insert class', async () => {
    CASES.forEach(async (c) => {
      const result = await updateContentClass(c.code, NEW_CLASS);
      expect(result).toEqual(c.expected);
    })
  });

});
