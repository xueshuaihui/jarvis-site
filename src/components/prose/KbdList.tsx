/** 快捷键表：mono chip + 说明 */
export function KbdList({ items }: { items: { k: string; what: string }[] }) {
  return (
    <div className="my-5 space-y-2">
      {items.map(({ k, what }) => (
        <div key={k} className="flex items-center gap-3 text-[13px]">
          <kbd className="min-w-28 rounded-md border border-arc-dim/50 bg-void-2 px-2 py-1 text-center font-mono text-[11px] text-arc/90">{k}</kbd>
          <span className="text-mid">{what}</span>
        </div>
      ))}
    </div>
  );
}
