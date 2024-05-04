import { ChatOpenAI } from "@langchain/openai";
import { JsonOutputKeyToolsParser } from "@langchain/core/output_parsers/openai_tools";
import { Runnable } from "@langchain/core/runnables";
import { openAiConfig } from "$lib/utils/env";
import { StructuredTool } from "@langchain/core/tools";
import { convertToOpenAITool } from "@langchain/core/utils/function_calling";
import { z } from "zod";

/**
 * https://js.langchain.com/docs/modules/model_io/chat/function_calling
 * 
 * Note that the descriptions here are crucial, as they will be passed along
 * to the model along with the class name.
 */

class TranslationTool extends StructuredTool {
    name = "modify_code";
    description = "A tool to process modified code with changes.";
    schema = z.object({
        code: z.string().describe("The modified code chunk with the required changes implemented."),
    });
    async _call(params: z.infer<typeof this.schema>) {
        return "The answer";
    }
}

const translationTool = convertToOpenAITool(new TranslationTool());

export class InteractionService {
    private openAi: Runnable;

    constructor() {
        this.openAi = this.getModel();
    }

    private getModel() {
        return new ChatOpenAI({
            openAIApiKey: openAiConfig.apiKey,
            modelName: "gpt-3.5-turbo",
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

    async getCommand(prompt: string): Promise<string> {
        const response = (await this.openAi.invoke(prompt)) as { code: string }
        return response.code;
    }
}