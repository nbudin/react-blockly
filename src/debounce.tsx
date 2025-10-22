export default function debounce<Args extends unknown[]>(
  func: (...args: Args) => unknown,
  wait: number
): [(...args: Args) => void, () => void] {
  let timeout: number | null = null;
  let later: (() => void) | null = null;

  const debouncedFunction = (..._args: Args) => {
    later = () => {
      timeout = null;
      func(..._args);
    };
    if (timeout != null) {
      clearTimeout(timeout);
    }
    timeout = window.setTimeout(later, wait);
  };

  const cancel = () => {
    if (timeout != null) {
      clearTimeout(timeout);
      if (later) {
        later();
      }
    }
  };

  return [debouncedFunction, cancel];
}
