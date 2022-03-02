export default function debounce(func: any, wait: number) {
  let timeout: any = null;
  let later: any = null;

  const debouncedFunction = (...args: any) => {
    later = () => {
      timeout = null;
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };

  const cancel = () => {
    if (timeout !== null) {
      clearTimeout(timeout);
      later();
    }
  };

  return [debouncedFunction, cancel];
}
