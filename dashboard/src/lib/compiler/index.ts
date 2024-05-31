import { parse, walk } from 'svelte/compiler';

type Edit = {
    pos: number;
    remove?: number;
    content: string;
};

type ChangeObj = {
    startLine: number,
    endLine: number,
    attribute: string,
    content: string
}

export class SvelteCompiler {
    constructor() { }

    async writeAttribute(text: string, changes: ChangeObj[]): Promise<string> {
        const ast = parse(text);
        let line = 1;
        let lineStarts = [0];

        for (let i = 0; i < text.length; i++) {
            if (text[i] === '\n') {
                line++;
                lineStarts.push(i + 1);
            }
        }

        // Create a map of changes keyed by element signature (`startLine-endLine`)
        const changeMap = new Map<string, ChangeObj[]>();
        changes.forEach(change => {
            const key = `${change.startLine}-${change.endLine}`;
            if (!changeMap.has(key)) {
                changeMap.set(key, []);
            }
            changeMap.get(key)!.push(change);
        });

        let edits: Edit[] = [];

        walk(ast.html as any, {
            enter(node: any) {

                const nodeStartLine = lineStarts.findIndex(pos => pos > node.start) - 1;
                const nodeEndLine = lineStarts.findIndex(pos => pos > node.end) - 1;
                const key = `${nodeStartLine}-${nodeEndLine}`;

                // Retrieve changes for the current element
                if (node.type === 'Element' && changeMap.has(key)) {
                    console.log("element found")
                    const elementChanges = changeMap.get(key)!;
                    elementChanges.forEach(change => {
                        const attributes = node.attributes;
                        const targetAttr = attributes.find((attr: any) => attr.type === 'Attribute' && attr.name === change.attribute);

                        if (targetAttr) {
                            const firstValuePart = targetAttr.value[0];
                            const lastValuePart = targetAttr.value[targetAttr.value.length - 1];
                            edits.push({
                                pos: firstValuePart.start,
                                remove: lastValuePart.end - firstValuePart.start,
                                content: change.content
                            });
                        } else {
                            const insertPos = node.start + node.name.length + 1;
                            const isFirstAttribute = node.attributes.length === 0;
                            const spaceBefore = isFirstAttribute ? ' ' : ' ';  // Add space only if it's the first attribute
                            edits.push({
                                pos: insertPos,
                                content: `${spaceBefore}${change.attribute}="${change.content}"`
                            });
                        }
                    });
                }
            }
        });

        edits.sort((a, b) => b.pos - a.pos);
        for (const edit of edits) {
            text = text.slice(0, edit.pos) + edit.content + text.slice(edit.pos + (edit.remove || 0));
        }

        return text;
    }
}