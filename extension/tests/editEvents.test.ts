// @ts-ignore - Bun test exists
import { expect, test, describe } from 'bun:test';
import { convertEditEventToStyleChangeMap } from '$lib/utils/editEvents';

describe('Edit event converter', () => {
  test("convertEditEventToStyleChangeMap creates a style change map from edit events", () => {
    const editEvent = {
      oldVal: { color: "red", fontSize: "12px" },
      newVal: { color: "blue", fontSize: "14px" },
    };

    const expectedStyleChangeMap = {
      color: { key: "color", oldVal: "red", newVal: "blue" },
      fontSize: { key: "fontSize", oldVal: "12px", newVal: "14px" },
    };

    const styleChangeMap = convertEditEventToStyleChangeMap(editEvent);

    expect(styleChangeMap).toEqual(expectedStyleChangeMap);
  });

  test("convertEditEventToStyleChangeMap handles empty edit events", () => {
    const editEvent = {
      oldVal: {},
      newVal: {},
    };

    const expectedStyleChangeMap = {};

    const styleChangeMap = convertEditEventToStyleChangeMap(editEvent);

    expect(styleChangeMap).toEqual(expectedStyleChangeMap);
  });
});