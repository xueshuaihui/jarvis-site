import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

/**
 * Typewriter：等宽打字机 + 常驻 blink 光标。
 * start=false 时挂起；首次 start 后播一次不重播；reduced-motion 直接给全文。
 */
export function Typewriter({
  text,
  speed = 30,
  start = true,
  className = "",
}: {
  text: string;
  speed?: number;
  start?: boolean;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const [count, setCount] = useState(reduce ? text.length : 0);
  const started = useRef(false);

  useEffect(() => {
    if (reduce) {
      setCount(text.length);
      return;
    }
    if (!start || started.current) return;
    started.current = true;
    const timer = window.setInterval(() => {
      setCount((n) => {
        if (n >= text.length) {
          window.clearInterval(timer);
          return n;
        }
        return n + 1;
      });
    }, speed);
    return () => window.clearInterval(timer);
  }, [start, speed, text.length, reduce]);

  return (
    <span className={`font-mono ${className}`} aria-label={text}>
      <span aria-hidden>{text.slice(0, reduce ? text.length : count)}</span>
      <span
        aria-hidden
        className="ml-0.5 inline-block h-[1.1em] w-[0.55em] translate-y-[0.18em] bg-arc animate-blink"
      />
    </span>
  );
}
