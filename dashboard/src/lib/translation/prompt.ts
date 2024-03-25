import { Example, FewShotPromptTemplate, PromptTemplate } from "@langchain/core/prompts";

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

export class StylePromptService extends PromptService<{ framework: string, css: string, code: string }> {
  constructor() {
    const inputs = {
      framework: "framework",
      css: "css",
      code: "code",
    };
    const prompt = "Given HTML code, the framework it's used in, and CSS style changes, update the HTML code to implement the style changes using TailwindCSS. Use tailwindCSS arbitrary values when no Tailwind equivalent like in example. Aim to make minimal changes to the original code structure, leave the quote type, tag name and tag structure as is. Only make style changes. Generalize from the examples given.\nInput:\nCSS: {css}\nCode: {code}\nFramework: {framework}\n\nOutput Code:";
    const examplePrompt = "Example Input:\nCSS: {css}\nCode: {code}\nFramework: {framework}\n\nExample Output Code: {output}\n\n";
    const examples: Example[] = [
      {
        css: "background-color: #000000;",
        code: '<h1 class="bg-gray-200 text-red">',
        framework: "vue",
        output: '<h1 class="bg-black text-red">'
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

    super(prompt, inputs, {
      prompt: examplePrompt,
      examples: examples
    });
  }
}

export class TextPromptService extends PromptService<{ framework: string, newText: string, oldText: string, code: string }> {
  constructor() {
    const inputs = {
      framework: "framework",
      newText: "newText",
      oldText: "oldText",
      code: "code",
    };
    const prompt = "Given HTML code, the framework it's used in, the original old text, and the new text, update the HTML code to implement the text changes. Aim to make minimal changes to the original code structure, leave the quote type, tag name and tag structure as is. Only make text content changes. Generalize from the examples given.\nInput:\nOld Text: {oldText}\nNew Text: {newText}\nCode: {code}\nFramework: {framework}\n\nOutput Code:";
    const examplePrompt = "Example Input:\nOld Text: {oldText}\nNew Text: {newText}\nCode: {code}\nFramework: {framework}\n\nExample Output Code: {output}\n\n";
    const examples: Example[] = [
      {
        newText: "New Text",
        oldText: "Hello World",
        code: '<h1>Hello World</h1>',
        framework: "svelte",
        output: '<h1>New Text</h1>'
      },
      {
        newText: "Foo Fighters",
        oldText: "Foo Bar",
        code: '<p><span style={{ fontWeight: 700 }}>Foo </span>Bar</p>',
        framework: "tsx",
        output: '<p><span style={{ fontWeight: 700 }}>Foo </span>Fighters</p>'
      },
    ];
    super(prompt, inputs, {
      prompt: examplePrompt,
      examples: examples
    });
  }
}