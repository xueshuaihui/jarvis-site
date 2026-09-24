import { motion } from "motion/react";

/** PanelTitle：等宽小标签 + 左侧 4px 青色短横（短横先行，标签随后淡入） */
export function PanelTitle({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="mb-10 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <motion.span
          aria-hidden
          className="h-4 w-1 bg-arc"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
          style={{ transformOrigin: "left" }}
        />
        <motion.span
          className="font-mono text-xs tracking-[0.35em] text-arc/80"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.12, duration: 0.2 }}
        >
          {kicker}
        </motion.span>
      </div>
      <motion.h2
        className="text-3xl font-semibold text-hi md:text-4xl"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.15, duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
      >
        {title}
      </motion.h2>
    </div>
  );
}
