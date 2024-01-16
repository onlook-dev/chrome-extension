export function debounce(func: any, wait: number) {
  let timeout: any;
  let isInitialCall = true;

  return function (...args: any[]) {
    if (isInitialCall) {
      func.apply(this, args);
      isInitialCall = false;
    } else {
      const later = () => {
        clearTimeout(timeout);
        func.apply(this, args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    }
  };
}
