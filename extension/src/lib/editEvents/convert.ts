import type { ChangeValues, EditEvent } from '$shared/models'

// Look in tests for example. 
export function convertEditEventToChangeObject(editEvent: EditEvent, changeObject: Record<string, ChangeValues>) {
  /**
   * 1. Update changeObject with oldVal and newVal from editEvent
   * 2. Remove from changeObject if newVal is empty
   */

  const oldVal = editEvent.oldVal as Record<string, string>;
  Object.entries(editEvent.newVal).forEach(([style, newVal]) => {
    if (!changeObject[style]) {
      // If the style does not exist in changeObject, add it with oldVal and newVal
      changeObject[style] = {
        key: style,
        oldVal: oldVal[style] ?? '',
        newVal: newVal
      };
    } else {
      // If the style exists, only update newVal
      changeObject[style].newVal = newVal;
    }
  });

  // Remove the style change from changeObject if the newVal is empty
  Object.entries(changeObject).forEach(([key, val]) => {
    if (!val.newVal) {
      delete changeObject[key];
    }
  });

  return changeObject;
}