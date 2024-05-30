// @ts-ignore - Bun test exists
import { expect, test, describe, mock, beforeAll, beforeEach } from 'bun:test';
import { CompilerService } from '$lib/compiler';

describe('Compiler', () => {

    beforeEach(() => {
    })

    beforeAll(async () => {
    });

    test('should get correct change if nothing updated', async () => {
        const compiler: CompilerService = new CompilerService();
        const original = await Bun.file("tests/compiler/files/before.svelte").text();
        const expected = await Bun.file("tests/compiler/files/after.svelte").text();
        const res = await compiler.writeClasses(original, 38, 40);
        expect(res).toEqual(expected);

    });
});