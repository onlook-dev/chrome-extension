// @ts-ignore - Bun test exists
import { expect, test, describe } from 'bun:test';
import { getProcessedActivities } from '$lib/publish/helpers';
import { StyleTranslationInput, TextTranslationInput, ProcessedActivity } from '$shared/models/translation';
import { getStyleTranslationInput, getTextTranslationInput } from '$lib/publish/inputs';
import { TemplateNode } from '$shared/models';

describe('ProjectPublisher helpers', () => {
  test('should get processed activity', () => {
    // Setup
    const rootPath = 'root';
    const activities = {
      act1: { path: 'H4sIAASkXGYAA32MSw6DIBRF9/KmNVXBgmUd3cArPqwJHwPYiWHv1TjpwDi4yUlO7llhxvwBBSnqOoYlU6pvM450T1+ymaCClDHmF46g1oN3sJMnUC2vQAe7OA+KlQrID+dSlMOeZxi7yPxLuWd0cG7a3tD2hIOWSJzEQ5oBtRCSN9z0HXs/tzUtUWcIyg9DLs7N5gAAAA==' } as any,
      act2: { /* no path */ } as any,
      act3: { path: 'H4sIAASkXGYAA32MOw6DMBAF77JtUMCYr8+RC2zsNUHyB9kmDfLdA6JJkVA8aaTRmw0WTC8QEIMsg18TxfK24ET3+CaTCAqICUN64ARiO/kAMzsCwZoCpDerdSB4LoCc+i3rNp/6T2e86nxJVh0d6a2d9zuwgVDJHolT1/Zaoey6nldcD039HPdVjKjRBPkDRvCULOgAAAA=' } as any,
    };

    const expected: ProcessedActivity[] = [
      {
        activity: activities.act1,
        node: {
          path: "root/src/routes/+page.svelte",
          startTag: {
            start: {
              line: 13,
              column: 2,
            },
            end: {
              line: 13,
              column: 6,
            },
          },
          endTag: {
            start: {
              line: 22,
              column: 2,
            },
            end: {
              line: 22,
              column: 7,
            },
          },
          commit: "18eadc7ae3e657fdac667303f842b942b01ee4fe",
        }
      },
      {
        activity: activities.act3,
        node: {
          path: "root/src/routes/+page.svelte",
          startTag: {
            start: {
              line: 14,
              column: 3,
            },
            end: {
              line: 14,
              column: 25,
            },
          },
          endTag: {
            start: {
              line: 19,
              column: 3,
            },
            end: {
              line: 19,
              column: 10,
            },
          },
          commit: "18eadc7ae3e657fdac667303f842b942b01ee4fe",
        }
      }
    ];

    // Execute
    const processed = getProcessedActivities(activities as any, rootPath);
    // Assert
    expect(processed).toEqual(expected);
  });

  test('should get style translation input', () => {
    // Setup
    const content = `<div>
      <p>Some text here</p>
    </div>
  `;
    const node: TemplateNode = {
      path: 'root/path/to/activity1.html',
      startTag: {
        start: {
          line: 1,
          column: 1,
        },
        end: {
          line: 1,
          column: 6,
        },
      },
      endTag: {
        start: {
          line: 3,
          column: 1,
        },
        end: {
          line: 3,
          column: 7,
        },
      },
      commit: "18eadc7ae3e657fdac667303f842b942b01ee4fe",
    }

    const activity = {
      styleChanges: {
        color: { key: 'color', newVal: 'red', oldVal: 'black' },
        backgroundColor: { key: 'background-color', newVal: 'blue', oldVal: 'white' }
      },
      attributeChanges: {
        full: { key: 'full', newVal: 'custom mt-8', oldVal: 'custom mt-4' },
        updated: { key: 'updated', newVal: 'mt-8', oldVal: 'mt-4' }
      }
    } as any;

    const expected: StyleTranslationInput = {
      framework: 'html',
      css: 'color: red; background-color: blue',
      code: '<div>',
      tailwind: 'mt-8'
    };

    // Execute
    const translationInput = getStyleTranslationInput(content, node, activity);

    // Assert
    expect(translationInput).toEqual(expected);
  });

  test('should get text translation input', () => {
    // Setup
    const content = `<div>
  <p>Some text here</p>
</div>`;

    const node: TemplateNode = {
      path: 'root/path/to/activity1.html',
      startTag: {
        start: {
          line: 1,
          column: 1,
        },
        end: {
          line: 1,
          column: 6,
        },
      },
      endTag: {
        start: {
          line: 3,
          column: 1,
        },
        end: {
          line: 3,
          column: 7,
        },
      },
      commit: "18eadc7ae3e657fdac667303f842b942b01ee4fe",
    }

    const activity = {
      textChanges: {
        text: { newVal: 'New text', oldVal: 'Old text' },
      }
    } as any;

    const expected: TextTranslationInput = {
      framework: 'html',
      oldText: 'Old text',
      newText: 'New text',
      code: `<div>
  <p>Some text here</p>
</div>`
    };

    // Execute
    const translationInput = getTextTranslationInput(content, node, activity);

    // Assert
    expect(translationInput).toEqual(expected);
  });

  test('text translation should throw if no text changes', () => {
    // Setup
    const content = `<div>
      <p>Some text here</p>
    </div>
  `;
    const node: TemplateNode = {
      path: "root/src/routes/+page.svelte",
      startTag: {
        start: {
          line: 2,
          column: 7,
        },
        end: {
          line: 2,
          column: 10,
        },
      },
      endTag: {
        start: {
          line: 2,
          column: 14,
        },
        end: {
          line: 2,
          column: 18,
        },
      },
      commit: "18eadc7ae3e657fdac667303f842b942b01ee4fe",
    }

    const activity = {
      styleChanges: {
        color: { key: 'color', newVal: 'red', oldVal: 'black' },
        backgroundColor: { key: 'background-color', newVal: 'blue', oldVal: 'white' }
      }
    } as any;


    // Execute
    // Assert
    expect(async () => {
      const res = await getTextTranslationInput(content, node, activity)
      console.log(res);
    }).toThrow();
  });

});