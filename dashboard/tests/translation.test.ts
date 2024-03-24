// @ts-ignore - Bun test exists
import { expect, test, describe, mock, beforeAll } from 'bun:test';

describe('Translation service', () => {
  let TranslationService: any;

  // Need to mock env
  beforeAll(async () => {
    mock.module("$lib/utils/env", () => ({
      openAiConfig: {
        apiKey: 'mocked-api',
        organization: 'mocked-org',
      }
    }))
    const Translation = await import('$lib/translation');
    TranslationService = Translation.TranslationService;
  });

  test('translation service', async () => {
    const translationService = new TranslationService();
    console.log(translationService);
  });
})