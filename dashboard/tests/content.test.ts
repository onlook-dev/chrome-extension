
// @ts-ignore - Bun test exists
import { expect, test, describe } from 'bun:test';
import { updateContentChunk } from '$lib/publish/helpers';
import { PathInfo, } from '$shared/models/translation';

describe('Content editor', () => {
  test('should update content chunk with correct indentation', () => {
    const fileContent = `function example() {
      console.log("Hello, world!");
      // Placeholder
    }`;
    const newContentChunk = `console.log("Updated content!");`;
    const pathInfo: PathInfo = {
      path: 'root/path/to/activity1.js',
      startLine: 3,
      startTagEndLine: 3,
      endLine: 3,
    };

    const expectedOutput = `function example() {
      console.log("Hello, world!");
      console.log("Updated content!");
    }`;

    const updatedContent = updateContentChunk(fileContent, newContentChunk, pathInfo);

    expect(updatedContent).toBe(expectedOutput);
  });

  test('should update content chunk with correct indentation for all lines', () => {
    const fileContent = `<Image
            src="/assets/hero-main.jpg"
            className={clsx(
              "select-none",
              "rounded-xl",
              "aspect-auto",
              "grayscale-0"
            )}
            width={1000}
            height={1000}
            alt="main-image"
            draggable="false"
            quality={100}
          />`;

    const newContentChunk = `<Image
src="/assets/hero-main.jpg"
className={clsx(
  "select-none",
  "rounded-xl",
  "aspect-auto",
  "grayscale-0"
)}
width={1000}
height={1000}
alt="main-image"
draggable="false"
quality={100}
/>`;

    const pathInfo: PathInfo = {
      path: 'root/path/to/activity1.js',
      startLine: 1,
      startTagEndLine: 14,
      endLine: 14,
    };

    const expectedOutput = `<Image
            src="/assets/hero-main.jpg"
            className={clsx(
              "select-none",
              "rounded-xl",
              "aspect-auto",
              "grayscale-0"
            )}
            width={1000}
            height={1000}
            alt="main-image"
            draggable="false"
            quality={100}
          />`;

    const updatedContent = updateContentChunk(fileContent, newContentChunk, pathInfo);
    expect(updatedContent).toBe(expectedOutput);
  });

  test('should correctly handle new content with fewer lines than the original section', () => {
    const fileContent = `function example() {
      // Line 1
      // Line 2
      // Removing Line 3
    }`;
    const newContentChunk = `// New Line 1
// New Line 2`;
    const pathInfo: PathInfo = {
      path: 'root/path/to/activity1.js',
      startLine: 2,
      startTagEndLine: 4,
      endLine: 4,
    };

    const expectedOutput = `function example() {
      // New Line 1
      // New Line 2
    }`;

    const updatedContent = updateContentChunk(fileContent, newContentChunk, pathInfo);
    expect(updatedContent).toBe(expectedOutput);
  });

  test('should correctly handle new content with more lines than the original section', () => {
    const fileContent = `function example() {
      // Line 1
      // Line 2
    }`;

    const newContentChunk = `// New Line 1
// New Line2
// Additional Line 1
// Additional Line 2`;
    const pathInfo: PathInfo = {
      path: 'root/path/to/activity1.js',
      startLine: 2,
      startTagEndLine: 3,
      endLine: 3,
    };

    const expectedOutput = `function example() {
      // New Line 1
      // New Line2
      // Additional Line 1
      // Additional Line 2
    }`;

    const updatedContent = updateContentChunk(fileContent, newContentChunk, pathInfo);

    expect(updatedContent).toBe(expectedOutput);
  });

});