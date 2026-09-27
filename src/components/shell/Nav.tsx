import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { NAV_SECTIONS, LINKS } from "../../content/copy";
import { easeExit, easeOverlay } from "../../lib/motion";
import { ReactorLogo } from "../hud/ReactorLogo";

/**
 * 顶栏 HUD Nav：Logo + 4 高频锚点 + 金色主 CTA（一期结构不动，F3 拍板顶栏不加文档项）。
 * 锚点在 /docs 页自动带上首页路径（跨页回首页定位区块）。
 */
export function Nav() {
  const { pathname } = useLocation();
  const anchor = (id: string) => (pathname === "/" ? `#${id}` : `/#${id}`);
  const [compact, setCompact] = useState(false);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState<string>("");
  const [drawer, setDrawer] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      setCompact(window.scrollY > 80);
      setProgress(max > 0 ? window.scrollY / max : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    for (const s of NAV_SECTIONS) {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b backdrop-blur-xl transition-[height,background-color,border-color] duration-200 ${
        compact ? "h-14 border-arc/30 bg-void-1/85" : "h-16 border-arc-dim/40 bg-void-1/70"
      }`}
    >
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-4 md:px-8">
        <Link to="/" className="flex items-center gap-3" aria-label="Jarvis Workbench 首页" onClick={() => window.scrollTo({ top: 0 })}>
          <ReactorLogo size={compact ? 24 : 28} spin />
          <span className="font-mono text-sm font-semibold tracking-[0.25em] text-hi">
            JARVIS<span className="text-arc">·</span>WORKBENCH
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="主导航">
          {NAV_SECTIONS.map((s) => (
            <a
              key={s.id}
              href={anchor(s.id)}
              className={`relative px-4 py-2 text-sm transition-colors duration-140 ${
                active === s.id ? "text-arc" : "text-mid hover:text-hi"
              }`}
            >
              {s.label}
              {active === s.id && (
                <motion.span
                  layoutId="nav-ink"
                  className="absolute inset-x-3 -bottom-px h-px bg-arc shadow-glow"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
            </a>
          ))}
          <a
            href={LINKS.releasesLatest}
            target="_blank"
            rel="noreferrer"
            className="ml-4 rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-void-0 transition-[filter,box-shadow] duration-140 hover:brightness-110 animate-breathe-gold"
          >
            下载
          </a>
        </nav>

        <button
          className="rounded-lg border border-arc-dim p-2 text-arc md:hidden"
          onClick={() => setDrawer((v) => !v)}
          aria-label={drawer ? "关闭菜单" : "打开菜单"}
          aria-expanded={drawer}
        >
          {drawer ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* 滚动进度光束 */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-gradient-to-r from-arc/40 via-arc to-gold"
        style={{ transform: `scaleX(${progress})` }}
      />

      {/* 移动抽屉：入 200ms / 退 140ms（L2） */}
      <AnimatePresence>
        {drawer && (
          <motion.nav
            aria-label="移动导航"
            className="absolute inset-x-0 top-full border-b border-arc-dim bg-void-1/95 p-4 backdrop-blur-xl md:hidden"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, transition: easeExit }}
            transition={easeOverlay}
          >
            <div className="flex flex-col gap-1">
              {NAV_SECTIONS.map((s) => (
                <a
                  key={s.id}
                  href={anchor(s.id)}
                  onClick={() => setDrawer(false)}
                  className="rounded-lg px-3 py-2.5 text-sm text-mid hover:bg-arc-faint hover:text-arc"
                >
                  {s.label}
                </a>
              ))}
              <a
                href={LINKS.releasesLatest}
                target="_blank"
                rel="noreferrer"
                className="mt-2 rounded-lg bg-gold px-3 py-2.5 text-center text-sm font-semibold text-void-0"
              >
                下载 macOS / Windows 版
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
