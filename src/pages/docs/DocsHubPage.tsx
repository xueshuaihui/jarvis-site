import { motion } from "motion/react";
import { ArrowRight, Bot, Boxes, ClipboardCheck, Columns3, Download, FolderTree, History, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { DOC_PAGES, HUB_PATHS } from "../../content/docs-nav";
import { itemVariants, listVariants, rise } from "../../lib/motion";
import { PanelTitle } from "../../components/hud/PanelTitle";
import { BracketFrame } from "../../components/hud/BracketFrame";

const ICONS = {
  install: Download,
  concepts: Boxes,
  board: Columns3,
  review: ClipboardCheck,
  skills: Sparkles,
  org: FolderTree,
  agent: Bot,
  data: ShieldCheck,
  changelog: History,
} as const;

/** /docs Hub：九宫格章节卡（本页唯一 L3 编排组）+ 三条最快路径 */
export default function DocsHubPage() {
  return (
    <div>
      <PanelTitle kicker="FIELD MANUAL" title="贾维斯操作手册" />
      <p className="max-w-2xl text-sm leading-7 text-mid">
        从装好第一台电脑，到让 Agent 领走第一块任务——九章手册覆盖安装、看板、审核、技能、协作链路、Agent 接入与数据安全。
        全部内容与当前发布版本逐项对账，每页底部附出处。
      </p>

      <motion.div
        variants={listVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {DOC_PAGES.map((p) => {
          const Icon = ICONS[p.slug as keyof typeof ICONS];
          return (
            <motion.div key={p.slug} variants={itemVariants}>
              <Link to={`/docs/${p.slug}`} className="block h-full">
                <BracketFrame className="h-full rounded-lg">
                  <div className="flex h-full flex-col rounded-lg border border-arc-dim/20 bg-void-1/70 p-5 transition-[border-color,box-shadow] duration-140 hover:border-arc/50 hover:shadow-glow">
                    <div className="flex items-center justify-between">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-arc-dim/40 text-arc">
                        <Icon size={16} strokeWidth={1.6} />
                      </span>
                      <span className="font-mono text-[11px] text-lo">{p.no}</span>
                    </div>
                    <h3 className="mt-4 text-[15px] font-semibold text-hi">{p.title}</h3>
                    <p className="mt-2 flex-1 text-xs leading-6 text-mid">{p.summary}</p>
                    <span className="mt-3 font-mono text-[10px] tracking-[0.2em] text-arc/70">{p.kicker}</span>
                  </div>
                </BracketFrame>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="mt-16">
        <h2 className="mb-1 font-mono text-[11px] uppercase tracking-[0.3em] text-lo">Fast Tracks</h2>
        <motion.div {...rise} className="grid gap-4 md:grid-cols-3">
          {HUB_PATHS.map((t) => (
            <Link
              key={t.to}
              to={t.to}
              className="group rounded-xl border border-gold/30 bg-void-1/60 px-5 py-4 transition-[border-color] duration-140 hover:border-gold/70"
            >
              <p className="flex items-center justify-between text-sm font-semibold text-hi">
                {t.title}
                <ArrowRight size={14} className="text-gold transition-transform duration-140 group-hover:translate-x-0.5" />
              </p>
              <p className="mt-1.5 text-xs leading-6 text-mid">{t.what}</p>
            </Link>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
