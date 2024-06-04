import { type Example, FewShotPromptTemplate, PromptTemplate } from "@langchain/core/prompts";

interface PromptVariables {
  [key: string]: string;
}

export class PromptService<T extends PromptVariables> {
  private promptTemplate: PromptTemplate;
  private fewShotPromptTemplate: FewShotPromptTemplate | undefined;

  constructor(private prompt: string, public inputVariables: T, private example?: { prompt: string, examples: Example[] } | undefined) {
    this.promptTemplate = PromptTemplate.fromTemplate(prompt, inputVariables);

    if (example) {
      const examplePromptTemplate = PromptTemplate.fromTemplate(example.prompt, inputVariables);
      this.fewShotPromptTemplate = new FewShotPromptTemplate({
        examplePrompt: examplePromptTemplate,
        examples: example.examples,
        inputVariables: [...Object.keys(inputVariables)]
      });
    }
  }

  async getPrompt(variables: T): Promise<string> {
    const prompt = await this.promptTemplate.format(variables);
    if (this.fewShotPromptTemplate) {
      const fewshotPrompt = await this.fewShotPromptTemplate.format(variables);
      return `${fewshotPrompt}\n${prompt}`;
    }
    return prompt
  }
}

export class StylePromptService extends PromptService<{ request: string }> {
  constructor() {
    const inputs = {
      request: "request"
    };

    const prompt = "You are an HTML and CSS expert. Given the request, return the CSS to modify the HTMLElement\nRequest: {request}\n";

    // const examplePrompt = "Request: {request}\nOutput: {output}";
    // const examples: Example[] = [
    //   {
    //     request: "New Text",
    //     output: "Hello World"
    //   },
    // ];
    // const exmapleObj = {
    //   prompt: examplePrompt,
    //   examples: examples
    // }
    // super(prompt, inputs, exmapleObj);

    super(prompt, inputs,);
  }
}