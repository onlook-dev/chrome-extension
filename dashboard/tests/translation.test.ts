// @ts-ignore - Bun test exists
import { expect, test, describe, mock, beforeAll } from 'bun:test';
import type { TranslationService } from '$lib/translation';

describe('Translation service', () => {
  let TranslationService: any;

  // Need to mock env
  beforeAll(async () => {
    mock.module("$lib/utils/env", () => ({
      openAiConfig: {
        apiKey: process.env.PUBLIC_TEST_OPENAI_API_KEY,
      }
    }))
    const Translation = await import('$lib/translation');
    TranslationService = Translation.TranslationService;
  });

  test('translation service implements style correctly', async () => {
    const service: TranslationService = new TranslationService();
    let translation = await service.getStyleTranslation({
      framework: "tsx",
      code: "<Card className='mt-8'>",
      css: "background-color: blue; padding: 10px;",
    });

    let expected = "<Card className='mt-8 bg-blue-500 p-2'>";
    expect(translation).toBe(expected);
  });

  test('translation service implements text change correctly', async () => {
    const service: TranslationService = new TranslationService();
    let translation = await service.getStyleTranslation({
      framework: "tsx",
      code: "<Card className='mt-8'>",
      css: "background-color: blue; padding: 10px;",
    });

    let expected = "<Card className='mt-8 bg-blue-500 p-2'>";
    expect(translation).toBe(expected);
  });
})