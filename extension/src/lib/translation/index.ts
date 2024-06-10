import { ChatOpenAI } from "@langchain/openai";
import { StylePromptService } from "./prompt";
import { langfuseConfig, openAiConfig } from "$lib/utils/env";
import { CallbackHandler } from "langfuse-langchain";
import { type RunnableConfig } from "@langchain/core/runnables";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createOpenAIFunctionsAgent, AgentExecutor } from "langchain/agents";
import { type StructuredToolInterface } from "@langchain/core/tools";
import { z } from "zod";
import { DynamicStructuredTool } from "@langchain/community/tools/dynamic";

export class TranslationService {
  private stylePromptService: StylePromptService;
  private traceHandler: CallbackHandler;

  private styleResponse = z.object({
    changes: z.array(z.object({
      property: z.string().describe("The CSS property to change. Must be a valid CSS property."),
      value: z.string().describe("The value to set the property to. Must be a valid CSS value. Hex code must have hastag # in front."),
    })).describe("An array of style changes to make to the style"),
    summary: z.string().describe("A summary of the changes made"),
  })

  constructor(private projectId: string = "default") {
    this.stylePromptService = new StylePromptService();
    this.traceHandler = new CallbackHandler({ ...langfuseConfig, sessionId: this.projectId });
  }

  async getStyleChange(variables: typeof this.stylePromptService.inputVariables): Promise<z.infer<typeof this.styleResponse> | { error: string }> {
    const config: RunnableConfig = {
      configurable: { sessionId: "1" },
      callbacks: [this.traceHandler],
      runName: "Style run"
    };

    const model = new ChatOpenAI({
      openAIApiKey: openAiConfig.apiKey,
      modelName: "gpt-4o",
      temperature: 0,
      cache: true,
    }).withStructuredOutput(this.styleResponse)

    // Pass message history here
    const prompt = await this.stylePromptService.getPrompt(variables);
    try {
      console.log("Prompt", prompt);
      const response = await model.invoke(prompt, config);
      console.log("Response", response);
      return response;
    } catch (error) {
      console.error(error);
      return {
        error: `${error}`
      }
    }
  }
}