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

// Shared for Style Prompt Service
const styleInputs = {
  framework: "framework",
  css: "css",
  code: "code",
  tailwind: "tailwind",
};
const styleExamplePrompt = "CSS: {css}\nTailwind: {tailwind}\nCode: {code}\nFramework: {framework}\nOutput Code: {output}\n\n";

export class InlineCssPromptService extends PromptService<typeof styleInputs> {
  constructor() {
    const prompt = "Given HTML code, the framework it's used in, CSS style changes and optional Tailwind style change. Update the HTML code to implement the style changes. Aim to make minimal changes to the original code structure. Only make style changes, update existing styles when possible. DO NOT CLOSE TAGS UNCESSARILY. Generalize from the examples given.\nCSS: {css}\nTailwind: {tailwind}\nCode: {code}\nFramework: {framework}\nOutput Code:";
    const examples: Example[] = [
      {
        css: "color: #000000;",
        tailwind: "bg-red-500",
        code: '<h1>',
        framework: "vue",
        output: '<h1 style="color: #000000; background-color: red;">'
      },
      {
        css: "background-color: blue; border: 1px solid black;",
        tailwind: "",
        code: "<Card>",
        framework: "tsx",
        output: `<Card style={{{{ backgroundColor: blue, border: '1px solid black' }}}}>`
      },
      {
        css: "padding: 10px;",
        tailwind: "h-4",
        code: `<div id="foo" style="padding: 2px;">`,
        framework: "svelte",
        output: `<div id="foo" style="padding: 10px; 	height: 1rem;">`
      },
      {
        css: "font-size: 17px; color: #000000;",
        tailwind: "",
        code: '<span style="font-size: 16px;">',
        framework: "html",
        output: '<span style="font-size: 17px; color: #000000;">'
      },
      {
        css: "width: 67%;",
        code: `<div style={{{{ height: "10px"}}}}>`,
        tailwind: "",
        framework: "jsx",
        output: '<div style={{{{ height: "10px", width: "67%" }}}}>'
      },
    ];

    super(prompt, styleInputs, {
      prompt: styleExamplePrompt,
      examples: examples
    });
  }
}

export class TailwindPromptService extends PromptService<typeof styleInputs> {
  constructor() {

    const prompt = "Given HTML code, the framework it's used in, CSS style changes and optional Tailwind style change. Update the HTML code to implement the style changes using TailwindCSS. Use tailwindCSS arbitrary values when no Tailwind equivalent like in example. Aim to make minimal changes to the original code structure. Only make style changes, update existing styles when possible. DO NOT CLOSE TAGS UNCESSARILY. Generalize from the examples given.\nCSS: {css}\nTailwind: {tailwind}\nCode: {code}\nFramework: {framework}\nOutput Code:";
    const examples: Example[] = [
      {
        css: "background-color: #000000;",
        tailwind: "w-1/2",
        code: '<h1 class="bg-gray-200 text-red">',
        framework: "vue",
        output: '<h1 class="bg-black text-red w-1/2">'
      },
      {
        css: "margin: 20px; border: 1px solid black;",
        tailwind: "font-light",
        code: "<Card className='mt-8 font-bold'>",
        framework: "tsx",
        output: "<Card className='mt-8 font-light m-5 border border-black'/>"
      },
      {
        css: "background-color: blue; padding: 10px;",
        tailwind: "h-10",
        code: '<div class="h-4">',
        framework: "svelte",
        output: '<div class="h-10 bg-blue-500 p-2">'
      },
      {
        css: "font-size: 17px;",
        tailwind: "p-4",
        code: '<span class="text-gray-600">',
        framework: "html",
        output: '<span class="text-gray-600 text-[17px] p-4">'
      },
      {
        css: "width: 67%;",
        tailwind: "",
        code: '<div className="mt-4">',
        framework: "jsx",
        output: '<div className="mt-4 w-[67%]">'
      },
    ];

    super(prompt, styleInputs, {
      prompt: styleExamplePrompt,
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
    const prompt = "Given HTML code, the framework it's used in, the original old text, and the new text, update the HTML code to implement the text changes. Aim to make minimal changes to the original code structure, leave the quote type, tag name and tag structure as is. Only make text content changes. Generalize from the examples above.\nOld Text: {oldText}\nNew Text: {newText}\nCode: {code}\nFramework: {framework}\nOutput Code:";
    const examplePrompt = "Old Text: {oldText}\nNew Text: {newText}\nCode: {code}\nFramework: {framework}\n Output Code: {output}";
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