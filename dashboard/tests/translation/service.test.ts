// @ts-ignore - Bun test exists
import { expect, test, describe, mock, beforeAll } from 'bun:test';
import type { TranslationService } from '$lib/publish/translation';
import { langfuseConfig } from '$lib/utils/env';

// Should explicitly enable. Costs money to run.
const enabled = false;

const StyleFramework = {
  TailwindCSS: 'TailwindCSS',
  InlineCSS: 'InlineCSS',
}

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
    mock.module("$shared/models", () => ({
      StyleFramework
    }));

    mock.module("$lib/utils/env", () => ({
      openAiConfig: {
        apiKey: process.env.PUBLIC_TEST_OPENAI_API_KEY,
      },
      langfuseConfig: {}
    }))

    const Translation = await import('$lib/publish/translation');
    TranslationService = Translation.TranslationService;
  });

  test('translation service implements inlineCSS correctly', async () => {
    const service: TranslationService = new TranslationService();
    let translation = await service.getStyleTranslation({
      framework: "tsx",
      code: "<Button style={{ backgroundColor: 'red' }}>",
      css: "background-color: blue; padding: 10px;",
      tailwind: "",
    });

    let expected = "<Button style={{ backgroundColor: 'blue', padding: '10px' }}>";
    expect(translation).toBe(expected);
  });

  test('translation service implements tailwindCSS correctly', async () => {
    const service: TranslationService = new TranslationService();
    let translation = await service.getStyleTranslation({
      framework: "tsx",
      code: "<Card className='mt-8'>",
      css: "background-color: blue; padding: 10px;",
      tailwind: "",
    }, StyleFramework.TailwindCSS as any);

    let expected = "<Card className='mt-8 bg-blue-500 p-2'>";
    expect(translation).toBe(expected);
  });

  test('translation service implements inlineCSS correctly with tailwind input', async () => {
    const service: TranslationService = new TranslationService();
    let translation = await service.getStyleTranslation({
      framework: "tsx",
      code: "<Button style={{ backgroundColor: 'red' }}>123",
      css: "background-color: blue; padding: 10px;",
      tailwind: "text-blue-500",
    });

    let expected = "<Button style={{ backgroundColor: 'blue', padding: '10px' }}>123";
    expect(translation).toBe(expected);
  });

  test('translation service implements tailwindCSS correctly with tailwind input', async () => {
    const service: TranslationService = new TranslationService();
    let translation = await service.getStyleTranslation({
      framework: "tsx",
      code: "<><Card className='mt-8'>",
      css: "background-color: blue; padding: 10px;",
      tailwind: "h-10",
    }, StyleFramework.TailwindCSS as any);

    let expected = "<><Card className='mt-8 h-10 bg-blue-500 p-2'>";
    expect(translation).toBe(expected);
  });

  test('translation service implements text change correctly', async () => {
    const service: TranslationService = new TranslationService();
    let translation = await service.getTextTranslation({
      oldText: "Hello World",
      newText: "Foo Bar",
      framework: "tsx",
      code: "<Text className='mt-8'>Hello World</Text>>>",
    });

    let expected = "<Text className='mt-8'>Foo Bar</Text>>>";
    expect(translation).toBe(expected);
  });
})