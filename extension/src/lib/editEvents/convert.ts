import type { ChangeValues, ChildVal, EditEvent, EditType } from '$shared/models'

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

export function convertChangeObjectToEditEvents(
  selector: string,
  editType: EditType,
  changeObject: Record<string, ChangeValues> | ChildVal
): EditEvent[] {
  const editEvents: EditEvent[] = [];

  Object.entries(changeObject).forEach(([key, value]) => {
    const { oldVal, newVal, createdAt, updatedAt } = (value as ChangeValues);

    const editEvent: EditEvent = {
      selector,
      createdAt: createdAt ?? updatedAt ?? new Date().toISOString(),
      editType,
      oldVal: { [key]: oldVal as string },
      newVal: { [key]: newVal as string }
    };
    editEvents.push(editEvent);
  });

  return editEvents;
}

export function convertStructureChangeToEditEvents(
  selector: string,
  editType: EditType,
  changeObject: Record<string, ChangeValues> | ChildVal
): EditEvent[] {
  const editEvents: EditEvent[] = [];
  Object.entries(changeObject).forEach(([key, value]) => {
    const { oldVal, newVal, createdAt, updatedAt } = (value as ChangeValues);
    const editEvent: EditEvent = {
      selector,
      createdAt: updatedAt ?? createdAt ?? new Date().toISOString(),
      editType,
      oldVal: oldVal as ChildVal,
      newVal: newVal as ChildVal
    };
    editEvents.push(editEvent);
  });

  return editEvents;
}

