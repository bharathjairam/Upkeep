import type { ReactNode } from "react";

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-surface px-6 py-8 text-center text-sm text-body">
      {children}
    </div>
  );
}
