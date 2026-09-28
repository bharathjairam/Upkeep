export function PersonaSwitcher({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { id: string; label: string }[];
}) {
  return (
    <label className="flex flex-wrap items-center gap-2 text-sm text-body">
      <span className="shrink-0">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full max-w-[220px] truncate rounded-lg border border-border bg-surface-subtle px-2.5 py-1.5 text-sm font-semibold text-ink outline-none focus:border-accent sm:max-w-[260px]"
      >
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
