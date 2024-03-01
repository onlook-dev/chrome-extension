export const TAILWIND_PROMPT = `
Translate CSS to TailwindCSS in provided code chunks. Input is a 'changes' object with 'TranslationInput' items containing 'pathInfo' (keep unchanged), original code, and CSS properties. Output should match input structure, replacing CSS with Tailwind classes in 'codeChunk'. Ensure valid JSON output with terminated string.

- Input: 'TranslationInput' with 'pathInfo', 'newCss' (CSS properties as string), 'codeChunk' (original HTML/JSX).
- Output: 'TranslationOutput' with 'pathInfo', 'codeChunk' updated with Tailwind classes.

Example Input:
{
  "changes": [
    {
      "pathInfo": {...},
      "newCss": "color: red; background-color: blue; ...",
      "codeChunk": "<div class='text-center'>...</div>"
    }
    // More items...
  ]
}

Example Output:
{
  "changes": [
    {
      "pathInfo": {...},
      "codeChunk": "<div class='text-center text-red-500 bg-blue-500 ...'>...</div>"
    }
    // More items...
  ]
}
`;
