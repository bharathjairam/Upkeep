import type { JobStatus, Urgency } from "../../lib/types";
import { STATUS_META, URGENCY_META } from "../../lib/meta";

export function StatusBadge({ status }: { status: JobStatus }) {
  const meta = STATUS_META[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold whitespace-nowrap ${meta.className}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
      {meta.label}
    </span>
  );
}

export function UrgencyBadge({ urgency }: { urgency: Urgency }) {
  const meta = URGENCY_META[urgency];
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${meta.className}`}>
      {meta.label}
    </span>
  );
}
