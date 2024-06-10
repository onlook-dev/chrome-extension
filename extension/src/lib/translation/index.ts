import { ChatOpenAI } from "@langchain/openai";
import { StylePromptService } from "./prompt";
import { langfuseConfig, openAiConfig } from "$lib/utils/env";
import { CallbackHandler } from "langfuse-langchain";
import { type RunnableConfig } from "@langchain/core/runnables";
import { z } from "zod";
import { ChatMessageHistory } from "langchain/stores/message/in_memory";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { AIMessage, HumanMessage } from "@langchain/core/messages";

export class TranslationService {
  private stylePromptService: StylePromptService;
  private traceHandler: CallbackHandler;
  private chainWithHistory: RunnableWithMessageHistory<any, any>;
  private history = new Map<string, ChatMessageHistory>();

  private styleResponse = z.object({
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
    }).withStructuredOutput(this.styleResponse)

    const prompt = ChatPromptTemplate.fromMessages([
      ["system", "You are an HTML and CSS expert. Given the request, return the CSS to modify the HTMLElement. Make sure CSS values are valid  such as # in front of hex code, etc."],
      new MessagesPlaceholder("history"),
      ["human", "{request}"],
    ]);

    const chain = prompt.pipe(model);

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

    this.stylePromptService = new StylePromptService();
    this.traceHandler = new CallbackHandler({ ...langfuseConfig, sessionId: this.projectId });
  }

  async getStyleChange(variables: typeof this.stylePromptService.inputVariables): Promise<z.infer<typeof this.styleResponse> | { error: string }> {
    const sessionId = "1";
    const config: RunnableConfig = {
      configurable: { sessionId: sessionId },
      callbacks: [this.traceHandler],
      runName: "Style run"
    };

    try {
      const response = await this.chainWithHistory.invoke(variables, config);

      // Save history
      const his = this.history.get(sessionId) || new ChatMessageHistory();
      his.addMessage(new HumanMessage(variables.request));
      this.history.set(sessionId, his);

      return response;
    } catch (error) {
      console.error(error);
      return {
        error: `${error}`
      }
    }
  }
}