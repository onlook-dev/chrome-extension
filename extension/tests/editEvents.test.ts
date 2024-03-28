// @ts-ignore - Bun test exists
import { expect, test, describe } from 'bun:test';
// @ts-ignore - Module exists. TODO: Fix this for TS
import { convertEditEventToChangeObject } from '$lib/editEvents/convert';

describe('convertEditEventToChangeObject', () => {
  test('should add new styles to changeObject', () => {
    const editEvent = {
      oldVal: { color: 'red' },
      newVal: { color: 'blue', fontSize: '12px' }
    };
    const changeObject = {};

    const result = convertEditEventToChangeObject(editEvent, changeObject);

    expect(result).toEqual({
      color: { key: 'color', oldVal: 'red', newVal: 'blue' },
      fontSize: { key: 'fontSize', oldVal: '', newVal: '12px' }
    });
  });

  test('should update existing styles in changeObject', () => {
    const editEvent = {
      oldVal: { color: 'red' },
      newVal: { color: 'blue' }
    };
    const changeObject = {
      color: { key: 'color', oldVal: 'red', newVal: 'green' }
    };

    const result = convertEditEventToChangeObject(editEvent, changeObject);

    expect(result).toEqual({
      color: { key: 'color', oldVal: 'red', newVal: 'blue' }
    });
  });

  test('should remove styles from changeObject if newVal is empty', () => {
    const editEvent = {
      oldVal: { color: 'red', margin: '5px' },
      newVal: { color: '', margin: '10px' }
    };
    const changeObject = {
      color: { key: 'color', oldVal: 'red', newVal: 'green' },
      margin: { key: 'margin', oldVal: '5px', newVal: '5px' }
    };

    const result = convertEditEventToChangeObject(editEvent, changeObject);

    expect(result).toEqual({
      margin: { key: 'margin', oldVal: '5px', newVal: '10px' }
    });
    expect(result.color).toBeUndefined();
  });

  // Add more tests as needed to cover different scenarios and edge cases
});
