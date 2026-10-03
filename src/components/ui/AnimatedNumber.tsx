import { animate, useInView, useReducedMotion } from 'framer-motion';
import { useEffect, useRef } from 'react';

interface AnimatedNumberProps {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  /** Format with thousands separators. */
  grouped?: boolean;
  duration?: number;
  className?: string;
}

function format(n: number, decimals: number, prefix: string, suffix: string, grouped: boolean) {
  return (
    prefix +
    n.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
      useGrouping: grouped,
    }) +
    suffix
  );
}

/**
 * Counts toward `value` when visible and whenever `value` changes.
 * Writes to the DOM directly (no re-render per frame). Assistive tech reads a
 * visually-hidden copy of the final value, never the intermediate frames.
 */
export function AnimatedNumber({
  value,
  decimals = 0,
  prefix = '',
  suffix = '',
  grouped = true,
  duration = 1.1,
  className,
}: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const fromRef = useRef(0);
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  const reduce = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (reduce) {
      node.textContent = format(value, decimals, prefix, suffix, grouped);
      fromRef.current = value;
      return;
    }
    if (!inView) return;
    const controls = animate(fromRef.current, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        node.textContent = format(v, decimals, prefix, suffix, grouped);
      },
    });
    return () => {
      controls.stop();
      fromRef.current = value;
    };
  }, [value, inView, reduce, duration, decimals, prefix, suffix, grouped]);

  const final = format(value, decimals, prefix, suffix, grouped);

  return (
    <span className={className}>
      <span ref={ref} aria-hidden="true" className="tabular">
        {format(reduce ? value : 0, decimals, prefix, suffix, grouped)}
      </span>
      <span className="sr-only">{final}</span>
    </span>
  );
}
