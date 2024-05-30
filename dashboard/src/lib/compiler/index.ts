import { parse, walk } from 'svelte/compiler';

export class CompilerService {
    constructor() {
    }

    async writeClasses(text: string, startLine: number, endLine: number): Promise<string> {
        // Parse the Svelte code to get its abstract syntax tree (AST)
        const ast = parse(text);

        // Convert character indices to line numbers
        let line = 1;
        let lineStarts = [0];  // Indexes of line starts in text
        for (let i = 0; i < text.length; i++) {
            if (text[i] === '\n') {
                line++;
                lineStarts.push(i + 1);
            }
        }

        // Prepare an array to collect edits
        let edits: any[] = [];

        // Walk through the AST to find HTML nodes within the specified line range
        walk(ast.html as any, {
            enter(node, parent, prop, index) {
                // Determine the line number for node start and end
                const nodeStartLine = lineStarts.findIndex(pos => pos > node.start) - 1;
                const nodeEndLine = lineStarts.findIndex(pos => pos > node.end) - 1;

                if (node.type === 'Element' && nodeStartLine === startLine && nodeEndLine === endLine) {
                    console.log('Found node:', node.type);
                    const attributes = node.attributes;
                    const classAttr = attributes.find(attr => attr.type === 'Attribute' && attr.name === 'class');

                    if (classAttr) {
                        // If a class attribute exists, append 'hello'
                        const lastValue = classAttr.value[classAttr.value.length - 1];
                        edits.push({
                            pos: lastValue.end,
                            content: ' hello'
                        });
                    } else {
                        // If no class attribute, add one
                        edits.push({
                            pos: node.start + node.name.length + 1, // After '<tagname '
                            content: 'class="hello" '
                        });
                    }
                }
            }
        });

        console.log('Edits:', edits);
        // Apply edits in reverse order to not mess up the indices
        edits.sort((a, b) => b.pos - a.pos);
        for (const edit of edits) {
            text = text.slice(0, edit.pos) + edit.content + text.slice(edit.pos);
        }

        // Return the modified text
        return text;
    }
}
