import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

/**
 * ScanSweep：面板内 1px 青色扫描线。
 * trigger 数值变化时自左向右扫过一次（600ms，一次性，纯 transform）。
 */
export function ScanSweep({ trigger = 0, className = "" }: { trigger?: number | string; className?: string }) {
  const reduce = useReducedMotion();
  const [run, setRun] = useState(0);
  useEffect(() => setRun((n) => n + 1), [trigger]);
  if (reduce) return null;
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <motion.span
        key={run}
        className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-arc to-transparent"
        initial={{ x: "-100%", opacity: 0 }}
        animate={{ x: "100%", opacity: [0, 1, 1, 0] }}
        transition={{ duration: 0.6, ease: "easeInOut", times: [0, 0.15, 0.85, 1] }}
      />
    </div>
  );
}
