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
  ];

  test('should insert class', async () => {
    CASES.forEach(async (c) => {
      const result = await updateFileContent(c.code, NEW_CLASS);
      expect(result).toEqual(c.expected);
    })
  });

});
