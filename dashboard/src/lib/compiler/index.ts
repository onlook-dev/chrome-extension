import { parse, walk } from 'svelte/compiler';

export enum WriteType {
    CLASS = 'class',
    STYLE = 'style',
}

type Edit = {
    pos: number;
    remove?: number;
    content: string;
};

export class CompilerService {
    constructor() { }

    async writeAttribute(text: string, startLine: number, endLine: number, type: WriteType, content: string): Promise<string> {
        const ast = parse(text);
        let line = 1;
        let lineStarts = [0];
        for (let i = 0; i < text.length; i++) {
            if (text[i] === '\n') {
                line++;
                lineStarts.push(i + 1);
            }
        }

        let edits: Edit[] = [];

        walk(ast.html as any, {
            enter(node: any, parent, prop, index) {
                const nodeStartLine = lineStarts.findIndex(pos => pos > node.start) - 1;
                const nodeEndLine = lineStarts.findIndex(pos => pos > node.end) - 1;

                if (node.type === 'Element' && nodeStartLine === startLine && nodeEndLine === endLine) {
                    const attributes = node.attributes;
                    const targetAttr = attributes.find((attr: any) => attr.type === 'Attribute' && attr.name === type);

                    // If attribute exists, replace it. Otherwise insert it
                    if (targetAttr) {
                        // Replace the entire value of the found attribute
                        const firstValuePart = targetAttr.value[0];
                        const lastValuePart = targetAttr.value[targetAttr.value.length - 1];
                        edits.push({
                            pos: firstValuePart.start,
                            remove: lastValuePart.end - firstValuePart.start,
                            content: `${content}`
                        });
                    } else {
                        // Determine the position to insert the attribute
                        const insertPos = node.start + node.name.length + 1;
                        const needsSpaceBefore = text[insertPos] !== ' ';
                        const spaceBefore = needsSpaceBefore ? ' ' : '';
                        // Check if the next character is the end of the tag '>'
                        const isEndOfTag = text[insertPos] === '>';
                        const spaceAfter = isEndOfTag ? '' : ' ';

                        edits.push({
                            pos: insertPos,
                            content: `${spaceBefore}${type}="${content}"${spaceAfter}`
                        });
                    }
                }
            }
        });

        // Apply edits in reverse order to not mess up the indices
        edits.sort((a, b) => b.pos - a.pos);
        for (const edit of edits) {
            text = text.slice(0, edit.pos) + edit.content + text.slice(edit.pos + (edit.remove || 0));
        }

        return text;
    }
}
