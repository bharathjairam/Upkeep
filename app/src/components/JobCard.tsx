import type { ReactNode } from "react";
import type { Job } from "../lib/types";
import { useStore, isOverdue } from "../lib/store";
import { timeAgo } from "../lib/format";
import { StatusBadge, UrgencyBadge } from "./ui/Badge";
import { Timeline } from "./ui/Timeline";
import { AlertTriangle } from "lucide-react";

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function JobCard({ job, children }: { job: Job; children?: ReactNode }) {
  const { getProperty } = useStore();
  const property = getProperty(job.propertyId);
  const overdue = isOverdue(job);

  return (
    <div className="animate-fade-up rounded-2xl border border-border bg-surface p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-soft text-xs font-bold text-accent-dark">
            {initials(property.tenant)}
          </span>
          <div>
            <h3 className="text-[15px] font-semibold text-ink">
              {job.category} — {property.address}
            </h3>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[12px] text-muted">
              <span>{job.id}</span>
              <span>{property.tenant}</span>
              <span>{timeAgo(job.reportedAt)}</span>
              {overdue && (
                <span className="inline-flex items-center gap-1 font-semibold text-critical-ink">
                  <AlertTriangle className="h-3.5 w-3.5" /> overdue
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <UrgencyBadge urgency={job.urgency} />
          <StatusBadge status={job.status} />
        </div>
      </div>

      <p className="mt-3 text-sm text-body">{job.description}</p>

      {job.photoDataUrl && (
        <img src={job.photoDataUrl} alt="Attached" className="mt-3 h-14 w-14 rounded-lg border border-border object-cover" />
      )}

      {children}

      <Timeline log={job.log} />
    </div>
  );
}
