import { useEffect, useRef, useState } from "react";

interface UseIntersectionOptions extends IntersectionObserverInit {
  /** Once true, stop observing. Defaults to false. */
  once?: boolean;
}

/**
 * React hook for the Intersection Observer API.
 * Useful for lazy loading images, triggering animations, and infinite scroll.
 */
export function useIntersection<T extends Element>(
  options: UseIntersectionOptions = {}
): [React.RefObject<T>, boolean] {
  const { once = false, ...observerOptions } = options;
  const ref = useRef<T>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
      if (entry.isIntersecting && once) {
        observer.unobserve(el);
      }
    }, observerOptions);

    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [once]);

  return [ref, isIntersecting];
}
