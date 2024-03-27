// @ts-ignore - Bun test exists
import { expect, test, describe, mock, beforeAll } from 'bun:test';
import type { TranslationService } from '$lib/translation';

// Should explicitly enable. Costs money to run.
const enabled = true;

describe('Translation service', () => {
  let TranslationService: any;

  if (!enabled) {
    test.skip('Translation tests should be explicitly enabled', () => {
      expect(enabled).toBe(true);
    });
    return;
  }

  // Mocking env variable modules. Otherwise only available at Vite runtime.
  beforeAll(async () => {
    mock.module("$lib/utils/env", () => ({
      openAiConfig: {
        apiKey: process.env.PUBLIC_TEST_OPENAI_API_KEY,
      }
    }))
    const Translation = await import('$lib/translation');
    TranslationService = Translation.TranslationService;
    console.log(TranslationService);
  });

  test('translation service implements inlineCSS correctly', async () => {
    const service: TranslationService = new TranslationService();
    let translation = await service.getStyleTranslation({
      framework: "tsx",
      code: "<Card className='mt-8'>",
      css: "background-color: blue; padding: 10px;",
    });

    let expected = "<Card className='mt-8' style={{ backgroundColor: 'blue', padding: '10px' }}>";
    expect(translation).toBe(expected);
  });

  test('translation service implements tailwindCSS correctly', async () => {
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
    let translation = await service.getTextTranslation({
      oldText: "Hello World",
      newText: "Foo Bar",
      framework: "tsx",
      code: "<Text className='mt-8'>Hello World</Text>",
    });

    let expected = "<Text className='mt-8'>Foo Bar</Text>";
    expect(translation).toBe(expected);
  });
})