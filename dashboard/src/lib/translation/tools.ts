import { StructuredTool } from "@langchain/core/tools";
import { zodToJsonSchema } from "zod-to-json-schema";
import { convertToOpenAITool } from "@langchain/core/utils/function_calling";
import { z } from "zod";

/**
 * https://js.langchain.com/docs/modules/model_io/chat/function_calling
 * 
 * Note that the descriptions here are crucial, as they will be passed along
 * to the model along with the class name.
 */

const calculatorSchema = z.object({
  operation: z
    .enum(["add", "subtract", "multiply", "divide"])
    .describe("The type of operation to execute."),
  number1: z.number().describe("The first number to operate on."),
  number2: z.number().describe("The second number to operate on."),
});

class CalculatorTool extends StructuredTool {
  schema = calculatorSchema;

  name = "calculator";

  description = "A simple calculator tool";

  async _call(params: z.infer<typeof calculatorSchema>) {
    return "The answer";
  }
}

export const calculatorTool = convertToOpenAITool(new CalculatorTool());
