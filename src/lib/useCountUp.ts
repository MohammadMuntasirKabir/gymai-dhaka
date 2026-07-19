import { useEffect, useRef, useState } from "react";

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Counts up to `end` once the element scrolls into view. Returns the
 * current display value and a ref to attach to the observed element.
 * With reduced-motion enabled, jumps straight to `end`.
 */
export function useCountUp(end: number, duration = 1600): {
  value: number;
  ref: React.RefObject<HTMLSpanElement | null>;
} {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [value, setValue] = useState(() =>
    prefersReducedMotion() ? end : 0,
  );
  const started = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (prefersReducedMotion()) {
      // value is already initialised to `end` via the lazy initializer.
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (now: number) => {
            const p = Math.min((now - start) / duration, 1);
            // easeOutCubic
            const eased = 1 - Math.pow(1 - p, 3);
            setValue(Math.round(eased * end));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [end, duration]);

  return { value, ref };
}
