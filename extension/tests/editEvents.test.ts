// @ts-ignore - Bun test exists
import { expect, test, describe } from 'bun:test';
// @ts-ignore - Module exists
import { convertEditEventToChangeObject, convertChangeObjectToEditEvents } from '$lib/editEvents/convert';
// @ts-ignore - Module exists
import type { EditType } from '$shared/models';

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

});


describe('convertChangeObjectToEditEvents', () => {
  test('should create multiple EditEvents for each change', () => {
    const selector = '#testElement';
    const editType: EditType = 'styleChange';
    const changeObject = {
      color: { key: 'color', oldVal: 'red', newVal: 'blue' },
      fontSize: { key: 'fontSize', oldVal: '12px', newVal: '14px' },
      backgroundColor: { key: 'backgroundColor', oldVal: 'red', newVal: '' }
    };

    const result = convertChangeObjectToEditEvents(selector, editType, changeObject);

    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({
      selector: selector,
      createdAt: expect.any(String),
      editType: editType,
      oldVal: { color: 'red' },
      newVal: { color: 'blue' }
    });
    expect(result[1]).toEqual({
      selector: selector,
      createdAt: expect.any(String),
      editType: editType,
      oldVal: { fontSize: '12px' },
      newVal: { fontSize: '14px' }
    });
    expect(result[2]).toEqual({
      selector: selector,
      createdAt: expect.any(String),
      editType: editType,
      oldVal: { backgroundColor: 'red' },
      newVal: { backgroundColor: '' }
    });
  });
});