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
  schema = z.object({
    code: z.string().describe("The code chunk to modify."),
    css: z.string().describe("The CSS properties to apply to the code."),
    framework: z.string().describe("The suffix which indicates the framewor of the code"),
  });

  name = "modify_code";

  description = "A tool to modify code based on CSS properties.";

  async _call(params: z.infer<typeof this.schema>) {
    return "The answer";
  }
}

export const translationTool = convertToOpenAITool(new TranslationTool());
