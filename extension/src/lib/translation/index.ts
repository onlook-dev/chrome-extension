import { ChatOpenAI } from "@langchain/openai";
import { styleTool } from "./tools";
import { JsonOutputKeyToolsParser } from "@langchain/core/output_parsers/openai_tools";
import { Runnable } from "@langchain/core/runnables";
import { StylePromptService } from "./prompt";
import { langfuseConfig, openAiConfig } from "$lib/utils/env";
import { CallbackHandler } from "langfuse-langchain";

export class TranslationService {
  private openAi: Runnable;
  private stylePromptService: StylePromptService;
  private traceHandler: CallbackHandler;

  constructor(private projectId: string = "default") {
    this.openAi = this.getModel();
    this.stylePromptService = new StylePromptService();
    this.traceHandler = new CallbackHandler({ ...langfuseConfig, sessionId: this.projectId });
  }

  private getModel() {
    return new ChatOpenAI({
      openAIApiKey: openAiConfig.apiKey,
      modelName: "gpt-4o",
      temperature: 0,
      cache: true,
    }).bind({
      tools: [styleTool],
      tool_choice: styleTool
    }).pipe(new JsonOutputKeyToolsParser({
      keyName: styleTool.function.name,
      returnSingle: true,
    }));
  }

  async getStyleChange(variables: typeof this.stylePromptService.inputVariables): Promise<string> {
    const prompt = await this.stylePromptService.getPrompt(variables);
    const response = await this.openAi.invoke(prompt, { callbacks: [this.traceHandler], runName: "Style run" });
    return response;
  }
}