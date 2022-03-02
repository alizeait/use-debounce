import { useEffect, useState } from "react";
/**
 * Creates a debounced value that gets updated until after delay milliseconds have elapsed
 * since the last time useDebounce was invoked
 * If `delay` is omitted in an environment with `requestAnimationFrame`, value debounce
 * will be deferred until the next frame is drawn (typically about 16ms).
 * @param value T
 * @param delay number
 * @returns T
 */
export const useDebounce = <T = any>(value: T, delay?: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const useRaf =
      typeof delay !== "number" && typeof requestAnimationFrame === "function";
    let timer: any;
    const handler = () => {
      setDebouncedValue(value);
    };
    // If delay is not set, use RAF ~ 16ms
    if (useRaf) {
      timer = requestAnimationFrame(handler);
    } else {
      timer = setTimeout(handler, delay);
    }

    return () => {
      if (useRaf) {
        cancelAnimationFrame(timer);
      } else {
        clearTimeout(timer);
      }
    };
  }, [value, delay]);

  return debouncedValue;
};
