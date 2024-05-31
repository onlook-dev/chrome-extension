// @ts-ignore - Bun test exists
import { expect, test, describe, beforeAll } from 'bun:test';
import { SvelteCompiler } from '$lib/compiler';

describe('Compiler', () => {
    let compiler: SvelteCompiler;
    let originalText: string;
    let expectedText: string;

    beforeAll(async () => {
        compiler = new SvelteCompiler();
        originalText = await Bun.file("tests/compiler/files/before.svelte").text();
        expectedText = await Bun.file("tests/compiler/files/after.svelte").text();
    });

    test('should add or update attributes', async () => {
        const changes = [
            { startLine: 10, endLine: 10, attribute: 'class', content: "new" },
            { startLine: 11, endLine: 11, attribute: 'class', content: "new" },
            { startLine: 12, endLine: 12, attribute: 'style', content: "color: red;" },
            { startLine: 13, endLine: 13, attribute: 'style', content: "color: red;" },
            { startLine: 14, endLine: 14, attribute: 'style', content: "color: red;" },
        ]
        let res = await compiler.writeAttribute(originalText, changes);
        expect(res).toEqual(expectedText);
    });
});
