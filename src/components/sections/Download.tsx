import { motion, useReducedMotion } from "motion/react";
import { BookOpen, Cpu, DownloadCloud } from "lucide-react";
import { Link } from "react-router-dom";
import { DOWNLOAD, LINKS } from "../../content/copy";
import { itemVariants, listVariants } from "../../lib/motion";
import { PanelTitle } from "../hud/PanelTitle";

/**
 * S7 下载：macOS 双架构 + Windows x64 卡 + beta 通道小字须知。
 * 首次入视：卡片背后弧光展开一次；主按钮常驻极缓金色呼吸（全站唯一常驻 CTA 动效）。
 */
export function Download() {
  const reduce = useReducedMotion();
  return (
    <section id="download" className="relative z-10 mx-auto max-w-6xl px-4 py-24 md:px-8 md:py-32">
      <div className="flex flex-col items-center text-center">
        <PanelTitle kicker={DOWNLOAD.kicker} title={DOWNLOAD.title} />
        <motion.span
          className="mb-10 rounded-full border border-arc-dim px-4 py-1.5 font-mono text-xs text-arc"
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
        >
          {DOWNLOAD.badge}
        </motion.span>
      </div>

      <div className="relative">
        {/* 背后弧光：一次性扫出 */}
        {!reduce && (
          <motion.div
            aria-hidden
            className="absolute left-1/2 top-1/2 h-72 w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-arc/[0.07] blur-3xl"
            initial={{ scaleX: 0.2, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
          />
        )}
        <motion.div
          variants={listVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          className="relative grid grid-cols-1 gap-5 sm:grid-cols-2"
        >
          {DOWNLOAD.cards.map((c) => (
            <motion.div
              key={c.chip}
              variants={itemVariants}
              className="flex items-center justify-between rounded-xl border border-arc-dim/30 bg-void-1/80 p-6 transition-[border-color,box-shadow] duration-140 hover:border-arc/60 hover:shadow-glow"
            >
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-lg border border-arc-dim/40 text-arc">
                  <Cpu size={22} strokeWidth={1.6} />
                </span>
                <div className="text-left">
                  <p className="font-semibold text-hi">
                    {c.name} <span className="ml-1 font-mono text-xs text-arc">({c.chip})</span>
                  </p>
                  <p className="mt-0.5 text-xs text-mid">
                    {c.models} · {c.note}
                  </p>
                </div>
              </div>
              <div className="hidden text-left md:block">
                <p className="font-mono text-[11px] text-lo">{c.files}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="mt-10 flex flex-col items-center gap-6">
        {/* F3 拍板：首页 → 文档区入口卡（顶栏不加项） */}
        <Link
          to="/docs"
          className="group flex w-full max-w-2xl items-center justify-between gap-4 rounded-xl border border-arc-dim/40 bg-void-1/60 px-6 py-4 text-left transition-[border-color,box-shadow] duration-140 hover:border-arc/60 hover:shadow-glow"
        >
          <div className="flex items-center gap-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-arc-dim/40 text-arc">
              <BookOpen size={18} strokeWidth={1.6} />
            </span>
            <div>
              <p className="text-sm font-semibold text-hi">操作手册 · Field Manual</p>
              <p className="mt-0.5 text-xs text-mid">安装起步、看板与审核、技能工作台、Agent 接入与 28 工具参考、数据安全与排查</p>
            </div>
          </div>
          <span className="shrink-0 font-mono text-xs text-lo transition-colors duration-140 group-hover:text-arc">9 章 →</span>
        </Link>
        <a
          href={LINKS.releasesLatest}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2.5 rounded-lg bg-gold px-8 py-3.5 text-sm font-semibold text-void-0 transition-[filter] duration-140 hover:brightness-110 active:scale-[0.98] animate-breathe-gold"
        >
          <DownloadCloud size={17} />
          {DOWNLOAD.cta}
        </a>
        <ul className="max-w-2xl space-y-2 text-center font-mono text-xs leading-5 text-lo">
          {DOWNLOAD.finePrint.map((f) => (
            <li key={f}>· {f}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
