export const TAILWIND_PROMPT = `
Task: Convert raw CSS to Tailwind CSS classes within a given JavaScript object structure.

Input: TranslationInput Object
  - path: File path(string).
  - currentClasses: Current Tailwind classes(string).
  - newCss: Array of CSS changes(string[]).
Output: TranslationOutput Object
Follows TranslationInput structure, but newCss becomes newClasses: Converted Tailwind classes(string[]).

Guidelines:
1. Translate CSS to Tailwind: Convert newCss items to equivalent Tailwind classes.
2. Preserve Classes: Do not remove currentClasses unless required by newCss.
3. Modification: Add / replace classes based on newCss.If unable to translate, include the original CSS.
4. Fallback: Return original class when direct translation isn’t possible.
     
Example:
- Input:
{ path: "/style.css", currentClasses: "p-4", newCss: ["margin: 1rem", "padding: 2rem"] }
- Output:
{ path: "/style.css", currentClasses: "p-4", newClasses: ["m-4", "p-8"] }

Note: Use the latest Tailwind CSS documentation for class equivalents.`