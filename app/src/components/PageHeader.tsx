import type { ReactNode } from "react";

export function PageHeader({ title, description, right }: { title: string; description?: string; right?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink">{title}</h1>
        {description && <p className="mt-1 text-sm text-body">{description}</p>}
      </div>
      {right}
    </div>
  );
}

export function SectionTitle({ title, count }: { title: string; count: number }) {
  return (
    <div className="mb-3 mt-8 flex items-baseline justify-between first:mt-0">
      <h2 className="text-base font-semibold text-ink">{title}</h2>
      <span className="rounded-full border border-border bg-surface px-2 py-0.5 text-xs font-bold text-body">{count}</span>
    </div>
  );
}
