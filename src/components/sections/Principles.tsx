import { motion } from "motion/react";
import { MessageSquarePlus, Bot, ShieldCheck } from "lucide-react";
import { PRINCIPLES } from "../../content/copy";
import { itemVariants, listVariants } from "../../lib/motion";
import { PanelTitle } from "../hud/PanelTitle";
import { ScanSweep } from "../hud/ScanSweep";

const ICONS = [MessageSquarePlus, Bot, ShieldCheck];

/** S2 三条铁律：三卡 stagger 入场；Ⅲ 盾牌常驻呼吸（全区块唯一常驻动效） */
export function Principles() {
  return (
    <section id="principles" className="relative z-10 mx-auto max-w-6xl px-4 py-24 md:px-8 md:py-32">
      <PanelTitle kicker={PRINCIPLES.kicker} title={PRINCIPLES.title} />
      <motion.div variants={listVariants} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {PRINCIPLES.items.map((item, i) => {
          const Icon = ICONS[i];
          const goldCard = i === 2; // 铁律Ⅲ = 人的把关，金
          return (
            <motion.article
              key={item.numeral}
              variants={itemVariants}
              className={`group relative overflow-hidden rounded-xl border bg-void-1/70 p-6 transition-[border-color,box-shadow] duration-140 ${
                goldCard
                  ? "border-gold/40 hover:border-gold hover:shadow-glow-gold"
                  : "border-arc-dim/30 hover:border-arc/60 hover:shadow-glow"
              }`}
            >
              <ScanSweep trigger={0} />
              <div className="mb-5 flex items-center justify-between">
                <span className={`font-mono text-3xl ${goldCard ? "text-gold/80" : "text-arc/70"}`}>{item.numeral}</span>
                <span className={`${goldCard ? "text-gold animate-breathe-dim" : "text-arc/70"}`}>
                  <Icon size={22} strokeWidth={1.6} />
                </span>
              </div>
              <h3 className={`mb-3 text-lg font-semibold ${goldCard ? "text-gold" : "text-hi"}`}>{item.title}</h3>
              <p className="text-sm leading-6 text-mid">{item.body}</p>
              <p className="mt-5 border-t border-arc-dim/20 pt-4 font-mono text-xs text-lo line-through decoration-st-failed/60">
                {item.anti}
              </p>
            </motion.article>
          );
        })}
      </motion.div>
    </section>
  );
}
