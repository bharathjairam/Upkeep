import type { JobStatus, Urgency } from "./types";

export const STATUS_META: Record<JobStatus, { label: string; className: string; dot: string }> = {
  reported: { label: "New", className: "bg-accent-soft text-accent-dark", dot: "bg-accent" },
  awaiting_approval: { label: "Awaiting landlord approval", className: "bg-warning-soft text-warning-ink", dot: "bg-warning" },
  approved: { label: "Approved — needs vendor", className: "bg-accent-light text-accent-contrast", dot: "bg-accent-dark" },
  assigned: { label: "Assigned to vendor", className: "bg-accent-soft text-accent-dark", dot: "bg-accent" },
  in_progress: { label: "In progress", className: "bg-accent-light text-accent-contrast", dot: "bg-accent-dark" },
  completed: { label: "Awaiting tenant confirmation", className: "bg-warning-soft text-warning-ink", dot: "bg-warning" },
  closed: { label: "Closed", className: "bg-success-soft text-success-ink", dot: "bg-success" },
  declined: { label: "Declined by landlord", className: "bg-critical-soft text-critical-ink", dot: "bg-critical" },
};

export const URGENCY_META: Record<Urgency, { label: string; className: string }> = {
  emergency: { label: "Emergency", className: "border-critical text-critical-ink" },
  urgent: { label: "Urgent", className: "border-warning text-warning-ink" },
  routine: { label: "Routine", className: "border-border text-muted" },
};
