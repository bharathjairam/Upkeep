export function BarList({ items }: { items: { label: string; value: number }[] }) {
  const max = Math.max(1, ...items.map((i) => i.value));
  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-3">
          <div className="w-44 shrink-0 text-sm leading-tight text-body">{item.label}</div>
          <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-surface-subtle">
            <div className="h-full rounded-full bg-accent" style={{ width: `${(item.value / max) * 100}%` }} />
          </div>
          <div className="w-8 shrink-0 text-right text-sm font-semibold text-ink">{item.value}</div>
        </div>
      ))}
    </div>
  );
}
