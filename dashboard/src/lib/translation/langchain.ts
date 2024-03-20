import { ChatOpenAI } from "@langchain/openai";
import { calculatorTool } from "./tools";
import { JsonOutputToolsParser } from "@langchain/core/output_parsers/openai_tools";
import { Runnable } from "@langchain/core/runnables";

class LangchainService {
  private openAi: Runnable;
  constructor() {
    this.openAi = new ChatOpenAI({
      modelName: "gpt-3.5-turbo-0125",
      temperature: 0,
    }).bind({
      tools: [calculatorTool],
      tool_choice: calculatorTool
    }).pipe(new JsonOutputToolsParser());
  }

  createPrompt() {

  }

  async invoke(message: string) {
    return await this.openAi.invoke(message);
  }
}