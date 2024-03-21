import { ChatOpenAI } from "@langchain/openai";
import { translationTool } from "./tools";
import { JsonOutputKeyToolsParser } from "@langchain/core/output_parsers/openai_tools";
import { Runnable } from "@langchain/core/runnables";
import { GenericPromptService } from "./prompt";
import { openAiConfig } from "$lib/utils/env";

export class TranslationService {
  private openAi: Runnable;
  private promptService: GenericPromptService<any>;

  private inputs = {
    framework: "framework",
    css: "css",
    code: "code",
  };

  constructor() {
    this.openAi = this.getModel();
    this.promptService = this.getPromptService();
  }

  private getModel() {
    return new ChatOpenAI({
      openAIApiKey: openAiConfig.apiKey,
      modelName: "gpt-3.5-turbo-0125",
      temperature: 0,
    }).bind({
      tools: [translationTool],
      tool_choice: translationTool
    }).pipe(new JsonOutputKeyToolsParser({
      keyName: translationTool.function.name,
      returnSingle: true,
    }));
  }

  private getPromptService() {
    const template = `Given the following code chunk and new style changes in CSS, return the modified code chunk with the style changes implemented. Adapt to the style of the code as much as possible, use TailwindCss when appropriate.\n\nCSS: {${this.inputs.css}}\n\nCode: {${this.inputs.code}}\n\nFramework: {${this.inputs.framework}}`;
    const service = new GenericPromptService(template, this.inputs);
    return service;
  }

  async getTranslation(variables: typeof this.inputs): Promise<string> {
    const prompt = await this.promptService.getPrompt(variables);
    const response = (await this.openAi.invoke(prompt)) as { code: string }
    return response.code;
  }
}