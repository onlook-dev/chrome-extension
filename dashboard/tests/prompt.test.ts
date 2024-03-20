import { expect, test } from 'bun:test';
import { GenericPromptService } from '$lib/translation/prompt';

test('GenericPromptService returns formatted prompt', async () => {

  const vars = {
    adj: "adj",
    subj: "subj",
  };

  const template = `Tell me a {${vars.adj}} joke about {${vars.subj}}.`;

  const actualVariables = {
    adj: "funny",
    subj: "chickens",
  };

  const service = new GenericPromptService(template, vars);
  const prompt = await service.getPrompt(actualVariables);

  const expectedPrompt = `Tell me a ${actualVariables.adj} joke about ${actualVariables.subj}.`;

  expect(prompt).toBe(expectedPrompt);
});