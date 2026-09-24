import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/**
 * BracketFrame：HUD 取景框——四角 L 形描边。
 * 区块入场时四角自外 8px 收拢到位（L3 一次性），随后静止。
 */
export function BracketFrame({ children, className = "" }: { children?: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  const corners = [
    "left-0 top-0 border-l border-t",
    "right-0 top-0 border-r border-t",
    "left-0 bottom-0 border-l border-b",
    "right-0 bottom-0 border-r border-b",
  ];
  const offset = ["-8px -8px", "8px -8px", "-8px 8px", "8px 8px"];
  return (
    <div className={`relative ${className}`}>
      {corners.map((c, i) => (
        <motion.span
          key={c}
          aria-hidden
          className={`pointer-events-none absolute h-4 w-4 border-arc-dim ${c}`}
          initial={reduce ? { opacity: 0 } : { opacity: 0, x: offset[i].split(" ")[0], y: offset[i].split(" ")[1] }}
          whileInView={reduce ? { opacity: 1 } : { opacity: 1, x: 0, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
        />
      ))}
      {children}
    </div>
  );
}
