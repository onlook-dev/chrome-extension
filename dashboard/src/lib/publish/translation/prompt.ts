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
    const prompt = "You are an HTML and CSS expert. Given a code block, the framework it's used in, CSS style changes and optional Tailwind style change. Update the code to implement the style changes in inline styles. Only make inline style changes, update existing rules when applicable. ONLY EDIT THE INLINE STYLES. DO NOT ADD OR REMOVE ANYTHING ELSE EVEN IF THEY SEEM WRONG. Generalize from the examples given.\nCSS: {css}\nTailwind: {tailwind}\nCode: {code}\nFramework: {framework}\nOutput Code:";
    const examples: Example[] = [
      {
        css: "color: #000000;",
        tailwind: "bg-red-500",
        code: '<h1',
        framework: "vue",
        output: '<h1 style="color: #000000; background-color: red;"'
      },
      {
        css: "background-color: blue; border: 1px solid black;",
        tailwind: "",
        code: "<Card>other content</>",
        framework: "tsx",
        output: `<Card style={{{{ backgroundColor: blue, border: '1px solid black' }}}}>other content</>`
      },
      {
        css: "padding: 10px;",
        tailwind: "h-4",
        code: `</a><div id="foo" style="padding: 2px;">>>`,
        framework: "svelte",
        output: `</a><div id="foo" style="padding: 10px; 	height: 1rem;">>>`
      },
      {
        css: "font-size: 17px; color: #000000;",
        tailwind: "",
        code: '123 123<span style="font-size: 16px;">',
        framework: "html",
        output: '123 123<span style="font-size: 17px; color: #000000;">'
      },
      {
        css: "width: 67%;",
        code: `<div style={{{{ height: "10px"}}}}>other content</div>`,
        tailwind: "",
        framework: "jsx",
        output: '<div style={{{{ height: "10px", width: "67%" }}}}>other content</div>'
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

    const prompt = "You are an HTML, CSS and TailwindCSS expert. Given a code block, the framework it's used in, CSS style changes and optional Tailwind style change. Update the code to implement the style changes using TailwindCSS. Use arbitrary values when no Tailwind equivalent are available. Only make style changes, update existing tailwind classes when applicable. ONLY EDIT THE TAILWIND CLASSES. DO NOT ADD OR REMOVE ANYTHING ELSE EVEN IF THEY SEEM WRONG. Generalize from the examples given.\nCSS: {css}\nTailwind: {tailwind}\nCode: {code}\nFramework: {framework}\nOutput Code:";
    const examples: Example[] = [
      {
        css: "background-color: #000000;",
        tailwind: "w-1/2",
        code: '<h1 class="bg-gray-200 text-red"><p>',
        framework: "vue",
        output: '<h1 class="bg-black text-red w-1/2"><p>'
      },
      {
        css: "margin: 20px; border: 1px solid black;",
        tailwind: "font-light",
        code: "123 123<Card className='mt-8 font-bold'",
        framework: "tsx",
        output: "123 123<Card className='mt-8 font-light m-5 border border-black'"
      },
      {
        css: "background-color: blue; padding: 10px;",
        tailwind: "h-10",
        code: '<div class="h-4">>>',
        framework: "svelte",
        output: '<div class="h-10 bg-blue-500 p-2">>>'
      },
      {
        css: "font-size: 17px;",
        tailwind: "p-4",
        code: '<span class="text-gray-600" ></a>',
        framework: "html",
        output: '<span class="text-gray-600 text-[17px] p-4" ></a>'
      },
      {
        css: "width: 67%;",
        tailwind: "",
        code: '<><div className="mt-4"><>',
        framework: "jsx",
        output: '<><div className="mt-4 w-[67%]"><>'
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
    const prompt = "You are an HTML, CSS and JS expert. Given a code block, the original old text, and the new text. Update the code to implement the text changes. ONLY EDIT THE TEXT CHANGE. DO NOT ADD OR REMOVE ANYTHING ELSE EVEN IF THEY SEEM WRONG. Generalize from the examples given.\nOld Text: {oldText}\nNew Text: {newText}\nCode: {code}\nFramework: {framework}\nOutput Code:";
    const examplePrompt = "Old Text: {oldText}\nNew Text: {newText}\nCode: {code}\nFramework: {framework}\n Output Code: {output}";
    const examples: Example[] = [
      {
        newText: "New Text",
        oldText: "Hello World",
        code: '<h1>Hello World</h1>>>',
        framework: "svelte",
        output: '<h1>New Text</h1>>>'
      },
      {
        newText: "Foo Fighters",
        oldText: "Foo Bar",
        code: 'Other content<p><span style={{ fontWeight: 700 }}>Foo </span>Bar</p>',
        framework: "tsx",
        output: 'Other content<p><span style={{ fontWeight: 700 }}>Foo </span>Fighters</p>'
      },
      {
        newText: "What's going on?",
        oldText: "I said hey",
        code: '<p><span style={{ fontWeight: 700 }}>I said hey',
        framework: "tsx",
        output: "<p><span style={{ fontWeight: 700 }}>What's going on?"
      },
    ];
    super(prompt, inputs, {
      prompt: examplePrompt,
      examples: examples
    });
  }
}