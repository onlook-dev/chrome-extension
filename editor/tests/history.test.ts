import { expect, test, describe, beforeEach } from 'bun:test';
import { get } from 'svelte/store';
import { historyStore, redoStore, addToHistory, undoLastEvent, redoLastEvent } from '$lib/tools/edit/history';
import type { EditEvent } from '$lib/types/editor';

describe('history functionality', () => {
  const mockEvent = {
    type: 'STYLE_CHANGE',
    detail: {
      createdAt: new Date().toISOString(),
      selector: '.test',
      styleType: 'color',
      newVal: 'red',
      oldVal: 'blue',
      path: ['path', 'to', 'element']
    }
  };

  const mockEvent1 = {
    type: 'STYLE_CHANGE',
    detail: {
      createdAt: new Date().toISOString(),
      selector: '.test1',
      styleType: 'color1',
      newVal: 'red1',
      oldVal: 'blue1',
      path: ['path', 'to', 'element']
    }
  };

  beforeEach(() => {
    // Reset the stores before each test
    historyStore.set([]);
    redoStore.set([]);
  });

  test('addToHistory adds an event to the history', () => {
    addToHistory(mockEvent);
    const history: EditEvent = get(historyStore);
    expect(history.length).toBe(1);
    expect(history[0]).toEqual(mockEvent);
  });

  test('addToHistory deduplicates events in history', () => {
    addToHistory(mockEvent);
    addToHistory(mockEvent);
    addToHistory(mockEvent1);
    addToHistory(mockEvent1);
    const history: EditEvent = get(historyStore);
    expect(history.length).toBe(2);
    expect(history[0]).toEqual(mockEvent);
    expect(history[1]).toEqual(mockEvent1);
  });

  test('addToHistory deduplicates events in history if multiple', () => {
    addToHistory(mockEvent);
    addToHistory(mockEvent1);
    addToHistory(mockEvent1);
    addToHistory(mockEvent);
    addToHistory(mockEvent);
    const history: EditEvent = get(historyStore);
    expect(history.length).toBe(3);
    expect(history[0]).toEqual(mockEvent);
    expect(history[1]).toEqual(mockEvent1);
    expect(history[2]).toEqual(mockEvent);
  });

  test('undoLastEvent moves the last event from history to redo', () => {
    // Add to history and then undo
    addToHistory(mockEvent);
    undoLastEvent();

    const history: EditEvent = get(historyStore);
    const redo: EditEvent = get(redoStore);
    expect(history.length).toBe(0);
    expect(redo.length).toBe(1);
    expect(redo[0].type).toBe('STYLE_CHANGE');
  });

  test('redoLastEvent moves the last event from redo to history', () => {
    // Manually simulate an undo action
    addToHistory(mockEvent);
    undoLastEvent();
    redoLastEvent();

    const history: EditEvent = get(historyStore);
    const redo: EditEvent = get(redoStore);
    expect(history.length).toBe(1);
    expect(redo.length).toBe(0);
    expect(history[0].type).toBe('REDO_STYLE_CHANGE');
  });
});
