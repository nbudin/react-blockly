export default function debounce(func: (...args: any[]) => void, wait: number) {
  let timeout: any = null;
  let later: any = null;

  const debounced = (...args) => {
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

  return { debounced, cancel };
}
