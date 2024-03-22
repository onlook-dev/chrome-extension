import { ChatOpenAI } from "@langchain/openai";
import { translationTool } from "./tools";
import { JsonOutputKeyToolsParser } from "@langchain/core/output_parsers/openai_tools";
import { Runnable } from "@langchain/core/runnables";
import { GenericPromptService } from "./prompt";
import { openAiConfig } from "$lib/utils/env";

export class TranslationService {
  private openAi: Runnable;
  private promptService: GenericPromptService<any>;

  private inputs = {
    framework: "framework",
    css: "css",
    code: "code",
  };
  private output = 'output'
  private template = `Given HTML code, the framework, and new style changes in CSS, return the code chunk updated the style changes implemented either in inline css or tailwind. Adapt to the style of the code as much as possible, use TailwindCSS when no inline style exists. Do not make unecessary changes changing the tag name or closing the tag, leave the rest as is.\n\nInput:\n\nCSS: {${this.inputs.css}}\nCode: {${this.inputs.code}}\nFramework: {${this.inputs.framework}}`;
  private examples = [
    // {
    //   framework: "svelte",
    //   css: "width:16px;height:4rem",
    //   code: "<CustomTag id='foo'>",
    //   output: "<CustomTag id='foo' class='w-4 h-16'>"
    // },
    // {
    //   framework: "tsx",
    //   css: "color:#c21da4;",
    //   code: "<a>",
    //   output: "<a className='color-[#c21da4]'>"
    // },
  ];

  constructor() {
    this.openAi = this.getModel();
    this.promptService = this.getPromptService();
  }

  private getModel() {
    return new ChatOpenAI({
      openAIApiKey: openAiConfig.apiKey,
      modelName: "gpt-3.5-turbo-0125",
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
      this.template,
      this.inputs,
      this.examples
    );
    return service;
  }

  async getTranslation(variables: typeof this.inputs): Promise<string> {
    const prompt = await this.promptService.getPrompt(variables);
    const response = (await this.openAi.invoke(prompt)) as { code: string }
    return response.code;
  }
}