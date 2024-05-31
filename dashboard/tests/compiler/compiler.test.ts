// @ts-ignore - Bun test exists
import { expect, test, describe, beforeEach, beforeAll } from 'bun:test';
import { CompilerService, WriteType } from '$lib/compiler';

describe('Compiler', () => {
    let compiler: CompilerService;
    let originalText: string;
    let expectedText: string;

    beforeAll(async () => {
        compiler = new CompilerService();
        originalText = await Bun.file("tests/compiler/files/before.svelte").text();
        expectedText = await Bun.file("tests/compiler/files/after.svelte").text();
    });

    test('should add or update attributes', async () => {
        let res = await compiler.writeAttribute(originalText, 9, 9, WriteType.CLASS, "new");
        res = await compiler.writeAttribute(res, 10, 10, WriteType.CLASS, "new");
        res = await compiler.writeAttribute(res, 11, 11, WriteType.CLASS, "old new");

        res = await compiler.writeAttribute(res, 12, 12, WriteType.STYLE, "color: red;");
        res = await compiler.writeAttribute(res, 13, 13, WriteType.STYLE, "color: red;");
        console.log(res);

        expect(res).toEqual(expectedText);
    });
});
