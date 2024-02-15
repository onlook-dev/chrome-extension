/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-this-alias */
/**
 * Reduce calls to the passed function.
 *
 * @param func - Function to debounce.
 * @param threshold - The delay to avoid recalling the function.
 * @param execAsap - If true, the Function is called at the start of the threshold, otherwise the Function is called at the end of the threshold.
 */
export function debounce(func, threshold, execAsap = false) {
    let timeout;
    return function debounced(...args) {
        const self = this;
        if (timeout)
            clearTimeout(timeout);
        else if (execAsap)
            func.apply(self, args);
        timeout = setTimeout(delayed, threshold || 100);
        function delayed() {
            if (!execAsap)
                func.apply(self, args);
            timeout = null;
        }
    };
}
