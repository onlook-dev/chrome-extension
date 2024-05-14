import { ChatOpenAI } from "@langchain/openai";
import { translationTool } from "./tools";
import { JsonOutputKeyToolsParser } from "@langchain/core/output_parsers/openai_tools";
import { Runnable } from "@langchain/core/runnables";
import { InlineCssPromptService, TailwindPromptService, TextPromptService } from "./prompt";
import { openAiConfig } from "$lib/utils/env";
import { StyleFramework } from "$shared/models";

export class TranslationService {
  private openAi: Runnable;
  private inlineCssPromptService: InlineCssPromptService;
  private tailwindPromptService: TailwindPromptService;
  private textPromptService: TextPromptService;

  constructor() {
    this.openAi = this.getModel();
    this.inlineCssPromptService = new InlineCssPromptService();
    this.tailwindPromptService = new TailwindPromptService();
    this.textPromptService = new TextPromptService();
  }

  private getModel() {
    return new ChatOpenAI({
      openAIApiKey: openAiConfig.apiKey,
      modelName: "gpt-4o",
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

  async getStyleTranslation(variables: typeof this.inlineCssPromptService.inputVariables, styleFramework?: StyleFramework): Promise<string> {
    let prompt;
    switch (styleFramework) {
      case StyleFramework.TailwindCSS:
        prompt = await this.tailwindPromptService.getPrompt(variables);
        break;
      case StyleFramework.InlineCSS:
        prompt = await this.inlineCssPromptService.getPrompt(variables);
        break;
      default:
        prompt = await this.inlineCssPromptService.getPrompt(variables);
    }
    const response = (await this.openAi.invoke(prompt)) as { code: string }
    return response.code;
  }

  async getTextTranslation(variables: typeof this.textPromptService.inputVariables): Promise<string> {
    const prompt = await this.textPromptService.getPrompt(variables);
    const response = (await this.openAi.invoke(prompt)) as { code: string }
    return response.code;
  }
}