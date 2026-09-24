/**
 * Backdrop：全站常驻背景——细网格底纹 + 两团缓慢漂移的青/金辉光。
 * 纯 CSS transform 循环，无布局参与。
 */
export function Backdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* 网格 */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(63,217,243,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(63,217,243,.6) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      {/* 青辉光 */}
      <div className="absolute -left-1/4 top-[-10%] h-[60vmax] w-[60vmax] rounded-full bg-arc/[0.05] blur-3xl animate-spin-drift" />
      {/* 金辉光 */}
      <div
        className="absolute right-[-20%] bottom-[-20%] h-[50vmax] w-[50vmax] rounded-full bg-gold/[0.04] blur-3xl"
        style={{ animation: "breathe-dim 8s ease-in-out infinite" }}
      />
      {/* 顶部渐隐暗角 */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-void-0 to-transparent" />
    </div>
  );
}
