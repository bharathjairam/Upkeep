export function StatTile({
  value,
  label,
  tone = "default",
}: {
  value: string | number;
  label: string;
  tone?: "default" | "warn" | "danger";
}) {
  const valueClass = tone === "warn" ? "text-warning-ink" : tone === "danger" ? "text-critical-ink" : "text-ink";

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
      <div className={`text-2xl font-bold tracking-tight ${valueClass}`}>{value}</div>
      <div className="mt-1 text-sm text-body">{label}</div>
    </div>
  );
}
