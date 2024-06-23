import { EditorAttributes } from "./constants";
import type { Activity, ChangeValues, ChildVal, EditEvent, EditType } from "./models";

export function jsToCssProperty(key: string) {
  if (!key) return "";
  return key.replace(/([A-Z])/g, "-$1").toLowerCase();
}

export function debounce(func: any, wait: number) {
  let timeout: any;
  let isInitialCall = true;

  return function (...args: any[]) {
    if (isInitialCall) {
      // @ts-ignore
      func.apply(this, args);
      isInitialCall = false;
    } else {
      const later = () => {
        clearTimeout(timeout);
        // @ts-ignore
        func.apply(this, args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    }
  };
}

export function truncateString(str: string, num: number) {
  if (str.length <= num) {
    return str;
  }
  return str.slice(0, num) + "...";
}

export function isBase64ImageString(str: string) {
  const base64ImageRegex = /^data:image\/[a-zA-Z]+;base64,/;
  return base64ImageRegex.test(str);
}

export function getInitials(name: string) {
  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("");
  return initials.toUpperCase();
}

export function timeSince(date: Date): string {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    console.error("Invalid date provided");
    return "Invalid date";
  }

  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + "y";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + "m";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + "d";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + "h";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + "m";
  }
  return Math.floor(seconds) + "s";
}

export function formatStyleChanges(styleChanges: Record<string, ChangeValues>): string {
  return Object.values(styleChanges)
    .map(({ key, newVal }) => `${jsToCssProperty(key)}: ${newVal};`)
    .join('\n')
}

export function formatAttrChanges(attrChanges: Record<string, ChangeValues>): string {
  return Object.values(attrChanges)
    .map(({ key, newVal }) => `${key}: ${newVal};`)
    .join('\n')
}

export function shortenSelector(selector: string): string {
  const parts = selector.split(" ");
  return parts[parts.length - 1];
}

export function sortActivities(activities: Record<string, Activity>, reverse = false) {
  let reverseInt = reverse ? -1 : 1;
  return Object.values(activities).sort((a, b) => {
    return (a.updatedAt ?? a.createdAt) < (b.updatedAt ?? b.createdAt) ? reverseInt : -reverseInt;
  })
}

export function cleanCustomComponent(el: HTMLElement) {
  const cleanedChild = el.cloneNode(true) as HTMLElement;
  cleanedChild.removeAttribute(EditorAttributes.DATA_ONLOOK_OLD_VALS);
  cleanedChild.setAttribute('contenteditable', 'false');
  return cleanedChild;
}

export function getCustomComponentContent(el: HTMLElement) {
  const cleanedChild = cleanCustomComponent(el);
  const content = (new XMLSerializer).serializeToString(cleanedChild);
  return content;
}

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

