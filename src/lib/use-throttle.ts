import { useEffect, useRef, useState } from "react";

/**
 * Throttle a value — emits at most once per interval.
 * Useful for scroll/resize event handlers.
 *
 * @param value - The value to throttle
 * @param interval - Minimum time between updates in ms (default: 200)
 */
export function useThrottle<T>(value: T, interval = 200): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastUpdated = useRef<number>(0);

  useEffect(() => {
    const now = Date.now();
    const remaining = interval - (now - lastUpdated.current);
    if (remaining <= 0) {
      lastUpdated.current = now;
      setThrottledValue(value);
    } else {
      const timer = setTimeout(() => {
        lastUpdated.current = Date.now();
        setThrottledValue(value);
      }, remaining);
      return () => clearTimeout(timer);
    }
  }, [value, interval]);

  return throttledValue;
}

/**
 * Throttle a callback function — fires at most once per interval.
 *
 * @param fn - Function to throttle
 * @param interval - Minimum interval in ms (default: 200)
 */
export function useThrottledCallback<T extends (...args: unknown[]) => unknown>(
  fn: T,
  interval = 200
): (...args: Parameters<T>) => void {
  const fnRef = useRef(fn);
  fnRef.current = fn;
  const lastCalledRef = useRef<number>(0);

  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCalledRef.current >= interval) {
      lastCalledRef.current = now;
      fnRef.current(...args);
    }
  };
}
