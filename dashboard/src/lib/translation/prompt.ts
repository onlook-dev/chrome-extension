import { Example, FewShotPromptTemplate, PromptTemplate } from "@langchain/core/prompts";

interface PromptVariables {
  [key: string]: string;
}

export class GenericPromptService<T extends PromptVariables> {
  private promptTemplate: PromptTemplate;
  private fewShotPromptTemplate: FewShotPromptTemplate | undefined;

  constructor(prompt: string, inputVariables: T, example?: { prompt: string, examples: Example[] } | undefined) {
    this.promptTemplate = PromptTemplate.fromTemplate(prompt, inputVariables);

    if (example) {
      const examplePromptTemplate = PromptTemplate.fromTemplate(example.prompt, inputVariables);
      this.fewShotPromptTemplate = new FewShotPromptTemplate({
        examplePrompt: examplePromptTemplate,
        examples: example.examples,
        inputVariables: [...Object.keys(inputVariables)]
      });
    }
  }

  async getPrompt(variables: T): Promise<string> {
    const prompt = await this.promptTemplate.format(variables);
    if (this.fewShotPromptTemplate) {
      const fewshotPrompt = await this.fewShotPromptTemplate.format(variables);
      return `${fewshotPrompt}\n${prompt}`;
    }
    return prompt
  }
}