import { type EditEvent } from '$shared/models/editor'
import { type ChangeValues } from '$shared/models/activity'

export function convertEditEventToChangeObject(editEvent: EditEvent, changeObject: Record<string, ChangeValues>) {
  /**
   * 1. Convert edit event to styleChange map
   * 2. Update changeObject with oldVal and newVal
   * 3. Remove from changeObject if newVal is empty
   */
  const mappedStyleChange: Record<string, ChangeValues> = {};
  Object.entries(editEvent.newVal).forEach(([style, newVal]) => {
    const oldVal = editEvent.oldVal as Record<string, string>;
    mappedStyleChange[style] = { key: style, oldVal: oldVal[style], newVal };
  });

  // For each key in mappedStyleChange,
  // if key does not exist in activity, add the oldVal and newVal.
  // if it does, only apply newVal
  Object.entries(mappedStyleChange).forEach(([key, val]) => {
    if (!changeObject[key]) {
      changeObject[key] = {
        key: key,
        oldVal: val.oldVal ?? '',
        newVal: val.newVal
      } as ChangeValues
    } else {
      changeObject[key].newVal = val.newVal
    }
  })

  // Remove the style change in activity if the newVal is empty
  Object.entries(changeObject).forEach(([key, val]) => {
    if (!val.newVal) {
      delete changeObject[key]
    }
  })
  return changeObject
}