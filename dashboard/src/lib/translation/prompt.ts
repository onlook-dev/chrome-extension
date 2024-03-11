export const TAILWIND_PROMPT = `
Translate CSS to TailwindCSS in provided code chunks. Input is a 'changes' object with 'TranslationInput' items containing 'pathInfo' (keep unchanged), original code, and CSS properties. Output should match input structure, updating or insert Tailwind classes in 'codeChunk' corresonding to 'newCss'. Ensure valid JSON output with terminated string. Keep tab and spacing consistent with input.
Based on the path file name, use the right class or className attribute. For example, if the file is a jsx or tsx file, use className. If the file is a svelte file, use class.

- Input: JSON object 'pathInfo', 'newCss' (CSS properties as string), 'codeChunk' (original HTML/JSX).
- Output: JSON object with 'pathInfo', 'codeChunk' updated with Tailwind classes in class or className attribute.

Example Input:
{
  "changes": [
    {
      "pathInfo": {
        "path": "src/App.svelte",
      },
      "newCss": "color: red; background-color: blue; ...",
      "codeChunk": "<div class='text-center'>...</div>"
    },
    {
      "pathInfo": {
        "path": "src/App.tsx",
      },
      "newCss": "color: red; background-color: blue; ...",
      "codeChunk": "<div>...</div>"
    }
  ]
}

Example Output:
{
  "changes": [
    {
      "pathInfo": {
        "path": "src/App.svelte",
      },
      "codeChunk": "<div class='text-center text-red-500 bg-blue-500 ...'>...</div>"
    },
     {
      "pathInfo": {
        "path": "src/App.tsx",
      },
      "codeChunk": "<div className='text-center text-red-500 bg-blue-500 ...'>...</div>"
    }
  ]
}
`;
