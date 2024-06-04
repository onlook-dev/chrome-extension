import { StructuredTool } from "@langchain/core/tools";
import { convertToOpenAITool } from "@langchain/core/utils/function_calling";
import { z } from "zod";

/**
 * https://js.langchain.com/docs/modules/model_io/chat/function_calling
 * 
 * Note that the descriptions here are crucial, as they will be passed along
 * to the model along with the class name.
 */

class StyleTool extends StructuredTool {
  name = "style_change";
  description = "A tool to modify the style of an element";
  schema = z.object({
    changes: z.array(z.object({
      property: z.string().describe("The CSS property to change"),
      value: z.string().describe("The value to set the property to"),
    })).describe("An array of changes to make to the style"),
    summary: z.string().describe("A summary of the changes made"),
  });
  async _call(params: z.infer<typeof this.schema>) {
    return "The answer";
  }
}

export const styleTool = convertToOpenAITool(new StyleTool());
