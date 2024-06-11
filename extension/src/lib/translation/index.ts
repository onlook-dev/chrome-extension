import { ChatOpenAI } from "@langchain/openai";
import { langfuseConfig, openAiConfig } from "$lib/utils/env";
import { CallbackHandler } from "langfuse-langchain";
import { Runnable } from "@langchain/core/runnables";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { DynamicStructuredTool } from "@langchain/community/tools/dynamic";
import { z } from "zod";

import type { RunnableConfig } from "@langchain/core/runnables";
import { Tools, type InvokeParams, type InvokeResponse } from "$shared/models";

export class TranslationService {
  private traceHandler: CallbackHandler;
  private runnable: Runnable<any, any>;

  private styleSchema = z.object({
    changes: z.array(z.object({
      property: z.string().describe("The CSS property to change. Must be a valid CSS property."),
      value: z.string().describe("The value to set the property to. Must be a valid CSS value. Hex code must have hastag # in front."),
    })).describe("An array of style changes to make to the style"),
    summary: z.string().describe("A summary of the changes made"),
  })

  constructor(private projectId: string = "default") {
    const styleTool = new DynamicStructuredTool({
      name: Tools.STYLE,
      description: "A tool to add, remove or modify the styles of an element. When adding or modifying style, if no value specified, make an appropriate guess. When removing a style, set the value to the appropriate default value.",
      schema: this.styleSchema,
      func: async (params: z.infer<typeof this.styleSchema>) => {
        return "The answer";
      },
    });

    const modelWithTools = new ChatOpenAI({
      openAIApiKey: openAiConfig.apiKey,
      modelName: "gpt-4o",
      temperature: 0,
      cache: true,
    }).bindTools([styleTool]);

    const prompt = ChatPromptTemplate.fromMessages([
      ["system", "You are an HTML, JS and CSS expert. Given the request, return the correct tool calls or answer. If no valid tools for the request, return 'Sorry, I cannot do that.'."],
      ["human", "Element:`{element}`\nRequest: {content}"],
    ]);

    this.runnable = prompt.pipe(modelWithTools);
    this.traceHandler = new CallbackHandler({ ...langfuseConfig, sessionId: this.projectId });
  }

  async invoke(params: InvokeParams): Promise<InvokeResponse | { content: string }> {
    const config: RunnableConfig = {
      callbacks: [this.traceHandler],
      runName: "Prompt run"
    };

    try {
      const response = await this.runnable.invoke(params, config);
      return {
        tool_calls: response.tool_calls,
        content: response.content
      };
    } catch (error) {
      console.error(error);
      return {
        content: `${error}`
      }
    }
  }
}