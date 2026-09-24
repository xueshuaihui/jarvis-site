import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import { useState } from "react";
import { FAQ } from "../../content/copy";
import { easeExit, easeOverlay } from "../../lib/motion";
import { PanelTitle } from "../hud/PanelTitle";

/** S8 FAQ 手风琴：入 rise 200ms / 退 140ms；同屏至多 1 项展开 */
export function Faq() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="faq" className="relative z-10 mx-auto max-w-3xl px-4 py-24 md:px-8 md:py-32">
      <PanelTitle kicker={FAQ.kicker} title={FAQ.title} />
      <div className="divide-y divide-arc-dim/20 border-y border-arc-dim/20">
        {FAQ.items.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={item.q}>
              <button
                className="flex w-full items-center justify-between gap-4 px-1 py-5 text-left transition-colors duration-140 hover:text-arc"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
              >
                <span className={`text-sm font-medium md:text-base ${isOpen ? "text-arc" : "text-hi"}`}>{item.q}</span>
                <motion.span
                  aria-hidden
                  className="shrink-0 text-arc"
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ duration: 0.14, ease: [0.2, 0, 0, 1] }}
                >
                  <Plus size={18} />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="body"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4, transition: easeExit }}
                    transition={easeOverlay}
                    className="px-1 pb-5 text-sm leading-7 text-mid"
                  >
                    {item.a.split(/(?=xattr|当前为|一切支持|不会。|统一在|尚未|项目)/).map((seg, k) =>
                      seg.startsWith("xattr") ? (
                        <span key={k}>
                          <code className="rounded bg-void-2 px-1.5 py-0.5 font-mono text-xs text-arc">{seg}</code>
                        </span>
                      ) : (
                        <span key={k}>{seg}</span>
                      ),
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
