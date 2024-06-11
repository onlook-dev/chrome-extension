import { ChatOpenAI } from "@langchain/openai";
import { langfuseConfig, openAiConfig } from "$lib/utils/env";
import { CallbackHandler } from "langfuse-langchain";
import { type RunnableConfig } from "@langchain/core/runnables";
import { ChatMessageHistory } from "langchain/stores/message/in_memory";
import { RunnableWithMessageHistory, Runnable } from "@langchain/core/runnables";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { HumanMessage } from "@langchain/core/messages";
import { DynamicStructuredTool } from "@langchain/community/tools/dynamic";
import { z } from "zod";
import type { InvokeParams, InvokeResponse } from "$shared/models";
import { JsonOutputParser } from "@langchain/core/output_parsers";

export class TranslationService {
  private traceHandler: CallbackHandler;
  private chainWithHistory: Runnable<any, any>;
  private history = new Map<string, ChatMessageHistory>();

  private styleSchema = z.object({
    changes: z.array(z.object({
      property: z.string().describe("The CSS property to change. Must be a valid CSS property."),
      value: z.string().describe("The value to set the property to. Must be a valid CSS value. Hex code must have hastag # in front."),
    })).describe("An array of style changes to make to the style"),
    summary: z.string().describe("A summary of the changes made"),
  })

  constructor(private projectId: string = "default") {
    const model = new ChatOpenAI({
      openAIApiKey: openAiConfig.apiKey,
      modelName: "gpt-4o",
      temperature: 0,
      cache: true,
    });

    const styleTool = new DynamicStructuredTool({
      name: "style_change",
      description: "A tool to modify the style of an element",
      schema: this.styleSchema,
      func: async (params: z.infer<typeof this.styleSchema>) => {
        return "The answer";
      },
    });

    const modelWithTools = model.bindTools([styleTool]);

    const prompt = ChatPromptTemplate.fromMessages([
      ["system", "You are an HTML and CSS expert. Given the request, return the correct tool calls. If no valid tools for the request, return 'Sorry, I cannot do that.'."],
      // new MessagesPlaceholder("history"),
      ["human", "{content}"],
    ]);

    const chain = prompt.pipe(modelWithTools);

    this.chainWithHistory = new RunnableWithMessageHistory({
      runnable: chain,
      getMessageHistory: (sessionId: string) => {
        const his = this.history.get(sessionId) || new ChatMessageHistory();
        this.history.set(sessionId, his);
        return his;
      },
      inputMessagesKey: "question",
      historyMessagesKey: "history",
    });
    this.chainWithHistory = chain

    this.traceHandler = new CallbackHandler({ ...langfuseConfig, sessionId: this.projectId });
  }

  async invoke(params: InvokeParams): Promise<InvokeResponse | { content: string }> {
    // TODO: Session should be select + projectId
    const sessionId = "1";

    const config: RunnableConfig = {
      configurable: { sessionId: sessionId },
      callbacks: [this.traceHandler],
      runName: "Prompt run"
    };

    try {
      const response = await this.chainWithHistory.invoke(params, config);
      // Save history
      const his = this.history.get(sessionId) || new ChatMessageHistory();
      his.addMessage(new HumanMessage(params));
      this.history.set(sessionId, his);

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