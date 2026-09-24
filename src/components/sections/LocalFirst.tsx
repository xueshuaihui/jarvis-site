import { motion } from "motion/react";
import { Cpu, FileClock, HardDrive, Radio } from "lucide-react";
import { LOCAL } from "../../content/copy";
import { itemVariants, listVariants } from "../../lib/motion";
import { PanelTitle } from "../hud/PanelTitle";

const SAT_ICONS = [HardDrive, Radio, FileClock, Cpu];

/**
 * S6 本地优先：左文案 + 右环心示意。
 * 轨道环慢转（L4 12s）；卫星点 hover 亮标签；红边界入场时从中心向两侧画出。
 */
export function LocalFirst() {
  return (
    <section id="local" className="relative z-10 mx-auto max-w-6xl px-4 py-24 md:px-8 md:py-32">
      <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
        <div>
          <PanelTitle kicker={LOCAL.kicker} title={LOCAL.title} />
          <motion.ul variants={listVariants} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} className="space-y-5">
            {LOCAL.points.map((p) => (
              <motion.li key={p.t} variants={itemVariants} className="flex gap-4">
                <span aria-hidden className="mt-2 h-px w-6 shrink-0 bg-arc-dim" />
                <div>
                  <p className="font-medium text-hi">{p.t}</p>
                  <p className="mt-1 text-sm leading-6 text-mid">{p.d}</p>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        </div>

        {/* 环心示意 */}
        <motion.div
          className="relative mx-auto aspect-square w-full max-w-md"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          {/* 旋转轨道 */}
          <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full animate-spin-slow" aria-hidden fill="none">
            <circle cx="200" cy="200" r="150" stroke="var(--color-arc-dim)" strokeDasharray="4 8" />
            <circle cx="200" cy="200" r="96" stroke="var(--color-arc)" strokeOpacity="0.18" />
          </svg>
          {/* 外网禁出边界：红色虚线 + 断口，入场一次性从中心向两侧描出 */}
          <motion.div
            aria-hidden
            className="absolute inset-[-6%]"
            initial={{ clipPath: "inset(50% 50% 50% 50%)" }}
            whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1], delay: 0.2 }}
          >
            <svg viewBox="0 0 400 400" className="h-full w-full" fill="none">
              <circle cx="200" cy="200" r="184" stroke="var(--color-st-failed)" strokeOpacity="0.55" strokeDasharray="10 14" />
              <path d="M330 70 L370 110 M370 70 L330 110" stroke="var(--color-st-failed)" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <span className="absolute right-2 top-14 font-mono text-[10px] tracking-[0.25em] text-st-failed/80">
              {LOCAL.boundaryLabel}
            </span>
          </motion.div>
          {/* 圆心：本机 */}
          <div className="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-1 rounded-full border border-arc bg-void-1 shadow-glow">
            <Cpu size={22} className="text-arc" strokeWidth={1.6} />
            <span className="font-mono text-[10px] text-arc">本机</span>
          </div>
          {/* 卫星点：四象限静止，hover 亮标签 */}
          {[
            { pos: "left-1/2 top-[calc(50%-150px)] -translate-x-1/2", label: LOCAL.satellites[0], Icon: SAT_ICONS[0] },
            { pos: "right-[calc(50%-150px)] top-1/2 -translate-y-1/2", label: LOCAL.satellites[1], Icon: SAT_ICONS[1] },
            { pos: "left-1/2 bottom-[calc(50%-150px)] -translate-x-1/2", label: LOCAL.satellites[2], Icon: SAT_ICONS[2] },
            { pos: "left-[calc(50%-150px)] top-1/2 -translate-y-1/2", label: LOCAL.satellites[3], Icon: SAT_ICONS[3] },
          ].map(({ pos, label, Icon }) => (
            <div key={label} className={`group absolute ${pos}`}>
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-arc-dim bg-void-2 text-arc/80 transition-[border-color,box-shadow] duration-140 group-hover:border-arc group-hover:shadow-glow">
                <Icon size={16} strokeWidth={1.6} />
              </div>
              <span className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded border border-arc-dim bg-void-1 px-2 py-0.5 font-mono text-[10px] text-arc opacity-0 transition-opacity duration-140 group-hover:opacity-100">
                {label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
