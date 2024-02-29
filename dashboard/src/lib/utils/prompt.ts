export const TAILWIND_PROMPT = `Your job is to translate traditional CSS class definitions into Tailwind CSS equivalents. The input will be a json object called changes with an array of objects containing a file path, a string of original CSS classes, and a string representing new CSS properties and their values. The output should be the same changes object mapping to a same array with each json object having the same path and the original CSS classes translated into their Tailwind CSS equivalents based on the provided new CSS properties.
Input object:
- pathInfo: Object; // Information about the file path, keep this the same in output
- classes: string; // A space-separated string of original CSS class names
- newCss: string; // CSS properties and values, formatted as a string

Output object:
- pathInfo: Object; // Information about the file path, keep this the same in output
- classes: string; // A space-separated string of translated Tailwind CSS class names

You should consider the new CSS properties and values to determine the most appropriate Tailwind CSS classes. For example, if the newCss string includes 'margin: 10px;', the corresponding Tailwind class might be 'm-2'. The goal is to create a precise mapping that leverages Tailwind's utility classes effectively.
Please try not to remove any existing classes, and only add new classes if necessary.
`;