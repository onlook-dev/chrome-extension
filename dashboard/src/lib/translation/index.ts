import { ChatOpenAI } from "@langchain/openai";
import { translationTool } from "./tools";
import { JsonOutputKeyToolsParser } from "@langchain/core/output_parsers/openai_tools";
import { Runnable } from "@langchain/core/runnables";
import { GenericPromptService } from "./prompt";
import { openAiConfig } from "$lib/utils/env";
import { Example } from "@langchain/core/prompts";

export class TranslationService {
  private openAi: Runnable;
  private promptService: GenericPromptService<any>;

  private inputs = {
    framework: "framework",
    css: "css",
    code: "code",
  };
  private prompt = "Given HTML code, the framework it's used in, and CSS style changes, update the HTML code to implement the style changes using TailwindCSS. Use tailwindCSS arbitrary values when no Tailwind equivalent like in example. Aim to make minimal changes to the original code structure, leave the quote type, tag name and tag structure as is. Only make style changes. Generalize from the examples given.\nInput:\nCSS: {css}\nCode: {code}\nFramework: {framework}\n\nOutput Code:";
  private examplePrompt = "Example Input:\nCSS: {css}\nCode: {code}\nFramework: {framework}\n\nExample Output Code: {output}\n\n";
  private examples: Example[] = [
    {
      css: "font-size: 20px;",
      code: '<h1 class="bg-red">',
      framework: "vue",
      output: '<h1 class="bg-red text-2xl">'
    },
    {
      css: "margin: 20px; border: 1px solid black;",
      code: "<Card className='mt-8'>",
      framework: "tsx",
      output: "<Card className='mt-8 m-5 border border-black'/>"
    },
    {
      css: "background-color: blue; padding: 10px;",
      code: '<div class="h-4">',
      framework: "svelte",
      output: '<div class="h-4 bg-blue-500 p-2">'
    },
    {
      css: "font-size: 17px;",
      code: '<span class="text-gray-600">',
      framework: "html",
      output: '<span class="text-gray-600 text-[17px]">'
    },
    {
      css: "width: 67%;",
      code: '<div className="mt-4">',
      framework: "jsx",
      output: '<div className="mt-4 w-[67%]">'
    },
  ];

  constructor() {
    this.openAi = this.getModel();
    this.promptService = this.getPromptService();
  }

  private getModel() {
    return new ChatOpenAI({
      openAIApiKey: openAiConfig.apiKey,
      modelName: "gpt-4",
      temperature: 0,
    }).bind({
      tools: [translationTool],
      tool_choice: translationTool
    }).pipe(new JsonOutputKeyToolsParser({
      keyName: translationTool.function.name,
      returnSingle: true,
    }));
  }

  // TODO: Add examples
  private getPromptService() {
    const service = new GenericPromptService(
      this.prompt,
      this.inputs,
      {
        prompt: this.examplePrompt,
        examples: this.examples
      }
    );
    return service;
  }

  async getTranslation(variables: typeof this.inputs): Promise<string> {
    const prompt = await this.promptService.getPrompt(variables);
    const response = (await this.openAi.invoke(prompt)) as { code: string }
    return response.code;
  }
}