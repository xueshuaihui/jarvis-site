import { Suspense } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { BookOpen, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { DOC_PAGES, RELEASE_BADGE } from "../../content/docs-nav";
import { easeExit, easeOverlay } from "../../lib/motion";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { DocsNavList } from "./DocsNavList";
import { TocRail } from "./TocRail";
import { BasisLine, DocPager } from "../prose/primitives";

/**
 * 文档区壳（设计稿 §4.1/§5）：≥xl 三栏、lg 两栏、<lg 单栏+目录抽屉；
 * 页面切换 L2-doc（入 200 / 出 140）；正文区无循环动画与 scroll reveal。
 */
export default function DocsLayout() {
  const { pathname, hash } = useLocation();
  const [drawer, setDrawer] = useState(false);
  const reduce = useReducedMotion();
  const slug = pathname.startsWith("/docs/") ? pathname.slice("/docs/".length) : "";

  useEffect(() => {
    if (!hash) window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname, hash]);

  return (
    <>
      <Nav />
      <div className="relative mx-auto flex w-full max-w-7xl gap-10 px-4 pt-24 pb-16 md:px-8">
        <aside className="hidden w-52 shrink-0 lg:block">
          <div className="sticky top-24">
            <p className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-lo">
              <BookOpen size={12} aria-hidden /> Field Manual
            </p>
            <DocsNavList />
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <div className="mb-6 lg:hidden">
            <button
              onClick={() => setDrawer((v) => !v)}
              className="flex w-full items-center justify-between rounded-xl border border-arc-dim/40 bg-void-1/70 px-4 py-2.5 text-sm text-mid"
              aria-expanded={drawer}
            >
              <span className="font-mono text-xs tracking-[0.2em] text-arc/80">文档目录</span>
              {drawer ? <X size={16} /> : <Menu size={16} />}
            </button>
            <AnimatePresence initial={false}>
              {drawer && (
                <motion.div
                  className="mt-2 overflow-hidden rounded-xl border border-arc-dim/40 bg-void-1/90 p-2 backdrop-blur-xl"
                  initial={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0, transition: easeExit }}
                  transition={easeOverlay}
                >
                  <DocsNavList onNavigate={() => setDrawer(false)} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={pathname}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4, transition: easeExit }}
              transition={easeOverlay}
            >
              <Suspense
                fallback={
                  <p className="py-24 text-center font-mono text-xs text-lo">
                    // LOADING<span className="animate-blink">▌</span>
                  </p>
                }
              >
                <Outlet />
              </Suspense>
              {slug && <BasisLine text={DOC_PAGES.find((p) => p.slug === slug)?.basis ?? ""} />}
              {slug && <DocPager slug={slug} />}
              <p className="mt-6 font-mono text-[11px] text-lo">
                文档口径对齐{" "}
                <Link to="/docs/changelog" className="text-arc/70 transition-colors duration-140 hover:text-arc">
                  {RELEASE_BADGE}
                </Link>{" "}
                · 2026-09
              </p>
            </motion.div>
          </AnimatePresence>
        </main>

        <TocRail slug={slug} />
      </div>
      <Footer />
    </>
  );
}
