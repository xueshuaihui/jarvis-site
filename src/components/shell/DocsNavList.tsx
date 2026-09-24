import { NavLink } from "react-router-dom";
import { motion } from "motion/react";
import { DOC_PAGES } from "../../content/docs-nav";

/** 文档树：10 项（文档首页 + 9 内容页），激活项金色竖条 layoutId 滑动 */
export function DocsNavList({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav aria-label="文档导航" className="space-y-0.5">
      <NavLink
        to="/docs"
        end
        onClick={onNavigate}
        className={({ isActive }) => `group relative block rounded-lg px-3 py-2 text-[13px] transition-colors duration-140 ${isActive ? "text-arc" : "text-mid hover:text-hi"}`}
      >
        {({ isActive }) => (
          <>
            {isActive && (
              <motion.span
                layoutId="docs-rail"
                aria-hidden
                className="absolute inset-y-1 left-0 w-0.5 rounded bg-gold shadow-glow-gold"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            <span className="font-mono text-[10px] tracking-[0.2em] text-lo">── </span>文档首页
          </>
        )}
      </NavLink>
      {DOC_PAGES.map((p) => (
        <NavLink
          key={p.slug}
          to={`/docs/${p.slug}`}
          onClick={onNavigate}
          className={({ isActive }) => `group relative block rounded-lg px-3 py-2 text-[13px] transition-colors duration-140 ${isActive ? "text-arc" : "text-mid hover:text-hi"}`}
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <motion.span
                  layoutId="docs-rail"
                  aria-hidden
                  className="absolute inset-y-1 left-0 w-0.5 rounded bg-gold shadow-glow-gold"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className="font-mono text-[10px] text-lo">{p.no} </span>
              {p.title}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
