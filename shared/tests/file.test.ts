import { expect, test, describe, beforeEach } from 'bun:test';
import { updateFileContent } from '../translation';

describe('files', () => {
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
      const result = await updateFileContent(c.code, NEW_CLASS);
      expect(result).toEqual(c.expected);
    })
  });

});
