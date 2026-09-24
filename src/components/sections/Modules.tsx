import { AnimatePresence, motion } from "motion/react";
import { MODULES } from "../../content/copy";
import { easeExit, easeOverlay, itemVariants, listVariants } from "../../lib/motion";
import { BracketFrame } from "../hud/BracketFrame";
import { PanelTitle } from "../hud/PanelTitle";
import { ScanSweep } from "../hud/ScanSweep";
import { SketchAgent, SketchBoard, SketchReview, SketchSettings, SketchSkills } from "./sketches";
import { useState } from "react";

const SKETCHES: Record<string, () => JSX.Element> = {
  board: SketchBoard,
  review: SketchReview,
  skills: SketchSkills,
  agent: SketchAgent,
  settings: SketchSettings,
};

/**
 * S4 能力模块：左大幅线框画框（内容整体切换）+ 右竖排可点列表。
 * 切换：旧构图 140ms 淡出下沉 / 新构图 200ms rise + 画框扫描线过一次；
 * 选中项青条 layoutId 滑动（工具 Sidebar 手法）。
 */
export function Modules() {
  const [active, setActive] = useState<string>(MODULES[0].key);
  const mod = MODULES.find((m) => m.key === active) ?? MODULES[0];
  const Sketch = SKETCHES[mod.key];

  return (
    <section id="modules" className="relative z-10 mx-auto max-w-6xl px-4 py-24 md:px-8 md:py-32">
      <PanelTitle kicker="COCKPIT PANELS" title="座舱面板：五大模块" />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[40fr_60fr]">
        {/* 画框 */}
        <BracketFrame className="order-2 min-h-72 bg-void-1/60 p-4 lg:order-1">
          <ScanSweep trigger={active} />
          <AnimatePresence mode="wait">
            <motion.div
              key={mod.key}
              className="h-full min-h-60"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4, transition: easeExit }}
              transition={easeOverlay}
            >
              <Sketch />
            </motion.div>
          </AnimatePresence>
        </BracketFrame>

        {/* 列表 */}
        <motion.div
          variants={listVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="order-1 flex flex-col gap-1 lg:order-2"
          role="tablist"
          aria-label="功能模块"
        >
          {MODULES.map((m) => {
            const isActive = m.key === active;
            return (
              <motion.button
                key={m.key}
                variants={itemVariants}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(m.key)}
                className={`relative rounded-lg px-4 py-3.5 text-left transition-colors duration-140 ${
                  isActive ? "bg-arc-faint" : "hover:bg-arc-faint/50"
                }`}
              >
                {isActive && (
                  <motion.span aria-hidden layoutId="mod-bar" className="absolute inset-y-2 left-0 w-[3px] rounded-full bg-arc shadow-glow" transition={{ type: "spring", stiffness: 380, damping: 32 }} />
                )}
                <p className={`text-base font-medium ${isActive ? "text-arc" : "text-hi"}`}>
                  {m.title}
                  <span className="ml-2 font-mono text-[10px] text-lo">{String(MODULES.indexOf(m) + 1).padStart(2, "0")}</span>
                </p>
                <AnimatePresence initial={false}>
                  {isActive ? (
                    <motion.div
                      key="body"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0, transition: easeExit }}
                      transition={{ ...easeOverlay, height: { duration: 0.2 } }}
                      className="overflow-hidden"
                    >
                      <p className="mt-1.5 text-sm leading-6 text-mid">{m.body}</p>
                      <ul className="mt-2.5 flex flex-wrap gap-x-5 gap-y-1">
                        {m.bullets.map((b) => (
                          <li key={b} className="flex items-center gap-1.5 font-mono text-[11px] text-lo">
                            <span className="h-1 w-1 rounded-full bg-arc/50" />
                            {b}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ) : (
                    <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-1 block text-xs text-lo">
                      点击查看
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
