import { PromptTemplate } from "@langchain/core/prompts";

interface PromptVariables {
  [key: string]: string;
}

export class GenericPromptService<T extends PromptVariables> {
  private promptTemplate: PromptTemplate;

  constructor(prompt: string, inputVariables: T) {
    this.promptTemplate = PromptTemplate.fromTemplate(prompt, inputVariables);
  }

  async getPrompt(variables: T): Promise<string> {
    const formattedPrompt = await this.promptTemplate.format(variables);
    return formattedPrompt;
  }
}