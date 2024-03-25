import { ChatOpenAI } from "@langchain/openai";
import { translationTool } from "./tools";
import { JsonOutputKeyToolsParser } from "@langchain/core/output_parsers/openai_tools";
import { Runnable } from "@langchain/core/runnables";
import { StylePromptService, TextPromptService } from "./prompt";
import { openAiConfig } from "$lib/utils/env";

export class TranslationService {
  private openAi: Runnable;
  private stylePromptService: StylePromptService;
  private textPromptService: TextPromptService;

  constructor() {
    this.openAi = this.getModel();
    this.stylePromptService = new StylePromptService();
    this.textPromptService = new TextPromptService();
  }

  private getModel() {
    return new ChatOpenAI({
      openAIApiKey: openAiConfig.apiKey,
      modelName: "gpt-4-turbo-preview",
      temperature: 0,
      cache: true,
    }).bind({
      tools: [translationTool],
      tool_choice: translationTool
    }).pipe(new JsonOutputKeyToolsParser({
      keyName: translationTool.function.name,
      returnSingle: true,
    }));
  }

  async getStyleTranslation(variables: typeof this.stylePromptService.inputVariables): Promise<string> {
    const prompt = await this.stylePromptService.getPrompt(variables);
    const response = (await this.openAi.invoke(prompt)) as { code: string }
    return response.code;
  }

  async getTextTranslation(variables: typeof this.textPromptService.inputVariables): Promise<string> {
    const prompt = await this.textPromptService.getPrompt(variables);
    const response = (await this.openAi.invoke(prompt)) as { code: string }
    return response.code;
  }
}