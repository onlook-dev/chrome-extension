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

    async writeAttribute(fileContent: string, changes: ChangeObj[]): Promise<string> {
        // Extract the <script> tag
        const scriptMatch = fileContent.match(/<script[^>]*>((.|\n|\r)*?)<\/script>/);
        let scriptContent = '';
        let scriptOffset = 0;
        let scriptLineCount = 0;
        if (scriptMatch) {
            scriptContent = scriptMatch[0];
            scriptOffset = fileContent.indexOf(scriptContent);
            fileContent = fileContent.replace(scriptContent, '');
            scriptLineCount = (scriptContent.match(/\n/g) || []).length;
        }

        const ast = parse(fileContent) as any;
        let line = 1;
        let lineStarts = [0];

        // Adjust lineStarts for missing <script> tag
        for (let i = 0; i < fileContent.length; i++) {
            if (fileContent[i] === '\n') {
                line++;
                lineStarts.push(i + 1);
            }
        }

        const changeMap = new Map<string, ChangeObj[]>();
        changes = changes.map(change => ({
            ...change,
            startLine: change.startLine - scriptLineCount,
            endLine: change.endLine - scriptLineCount
        }));
        changes.forEach(change => {
            const key = `${change.startLine}-${change.endLine}`;
            changeMap.set(key, (changeMap.get(key) || []).concat(change));
        });

        let edits: Edit[] = [];

        walk(ast.html, {
            enter(node: any) {
                const nodeStartLine = lineStarts.findIndex(pos => pos > node.start) - 1;
                const nodeEndLine = lineStarts.findIndex(pos => pos > node.end) - 1;
                const key = `${nodeStartLine}-${nodeEndLine}`;

                if (node.type === 'Element' && changeMap.has(key)) {
                    const elementChanges = changeMap.get(key);
                    if (!elementChanges) return;
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
                            edits.push({
                                pos: insertPos,
                                content: ` ${change.attribute}="${change.content}"`
                            });
                        }
                    });
                }
            }
        });

        edits.sort((a, b) => b.pos - a.pos);
        edits.forEach(edit => {
            fileContent = fileContent.slice(0, edit.pos) + edit.content + fileContent.slice(edit.pos + (edit.remove || 0));
        });

        // Reinsert the <script> tag at its original position
        if (scriptContent) {
            fileContent = fileContent.slice(0, scriptOffset) + scriptContent + fileContent.slice(scriptOffset);
        }

        return fileContent;
    }
}
