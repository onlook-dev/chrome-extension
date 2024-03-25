import type { EditEvent } from "$shared/models/editor";
import type { ChangeValues } from "$shared/models/activity";

export function convertEditEventToStyleChangeMap(
  editEvent: EditEvent
): Record<string, ChangeValues> {
  const styleChangeMap: Record<string, ChangeValues> = {};
  Object.entries(editEvent.newVal).forEach(([style, newVal]) => {
    const oldVal = editEvent.oldVal as Record<string, string>;
    styleChangeMap[style] = { key: style, oldVal: oldVal[style], newVal };
  });
  return styleChangeMap;
}
