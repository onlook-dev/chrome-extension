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

class ManipulateElementTool extends StructuredTool {
    name = "manipulate_element";
    description = "Manipulates an HTML element based on the specified action, key, and value. Actions include modifying styles, adding/removing classes or attributes, manipulating inner HTML, and handling events.";

    schema = z.object({
        action: z.string().describe("Specifies the type of manipulation to perform. Supported actions include 'style', 'function', 'addClass', 'removeClass', 'setAttribute', 'removeAttribute', 'addEventListener', 'removeEventListener', 'toggleVisibility', 'setInnerHTML', 'appendInnerHTML'."),
        key: z.string().describe("Depending on the action, this represents the CSS style property, function name, class name, attribute name, event type, or directly relates to inner HTML manipulation."),
        value: z.string().optional().describe("The value to set for the given key. This could be the value of a style property, arguments for an anonymous function, URL for an attribute like 'src', or content for inner HTML.")
    });

    async _call(params: z.infer<typeof this.schema>) {
        // Implement the interaction with the DOM or simulate the result based on parameters
        return "The manipulation has been applied based on the provided parameters.";
    }
}

const tool = convertToOpenAITool(new ManipulateElementTool());

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
            tools: [tool],
            tool_choice: tool
        }).pipe(new JsonOutputKeyToolsParser({
            keyName: tool.function.name,
            returnSingle: true,
        }));
    }

    async prompt(prompt: string): Promise<string> {
        return await this.openAi.invoke(prompt)
    }
}