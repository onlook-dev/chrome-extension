import { expect, test, describe } from 'bun:test';
import { stringToHex } from '../src/lib/tools/edit/colors';

describe('color parsing to HEX', () => {
  const testCases = [
    { input: 'red', expected: '#ff0000' },
    { input: '#FF5733', expected: '#ff5733' },
    { input: '#F5F', expected: '#ff55ff' },
    { input: '#FF573366', expected: '#ff5733' },
    { input: 'rgb(161, 201, 172)', expected: '#a1c9ac' },
    { input: 'rgba(255, 87, 51, 0.5)', expected: '#ff5733' },
    { input: 'hsl(136 23% 77%)', expected: '#b7d2be' },
    { input: 'oklch(70% 0.1 130)', expected: '#8aab67' },
  ];

  testCases.forEach(({ input, expected }, index) => {
    test(`correctly parses color ${index + 1} (${input}) to HEX`, () => {
      let hex = stringToHex(input)
      expect(hex).toBe(expected);
    });
  });
});