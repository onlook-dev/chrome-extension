import { Example, FewShotPromptTemplate, PromptTemplate } from "@langchain/core/prompts";

interface PromptVariables {
  [key: string]: string;
}

export class GenericPromptService<T extends PromptVariables> {
  private promptTemplate: PromptTemplate;
  private fewShotPromptTemplate: FewShotPromptTemplate | undefined;

  constructor(prompt: string, inputVariables: T, examples: Example[] = []) {
    this.promptTemplate = PromptTemplate.fromTemplate(prompt, inputVariables);

    if (examples.length > 0) {
      this.fewShotPromptTemplate = new FewShotPromptTemplate({
        examplePrompt: this.promptTemplate,
        examples,
        inputVariables: [...Object.keys(inputVariables)]
      });
    }
  }

  async getPrompt(variables: T,): Promise<string> {
    if (this.fewShotPromptTemplate) {
      return await this.fewShotPromptTemplate.format(variables);
    }
    return await this.promptTemplate.format(variables);
  }
}