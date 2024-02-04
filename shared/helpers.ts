import type { StyleChange } from "./models/activity";
import type { VisbugStyleChange } from "./models/visbug";

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

export function convertVisbugToStyleChangeMap(
  visbugStyleChange: VisbugStyleChange
): Record<string, StyleChange> {
  const styleChangeMap: Record<string, StyleChange> = {};
  Object.entries(visbugStyleChange.newVal).forEach(([style, newVal]) => {
    const oldVal = visbugStyleChange.oldVal[style];
    styleChangeMap[style] = { key: style, oldVal, newVal };
  });
  return styleChangeMap;
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
