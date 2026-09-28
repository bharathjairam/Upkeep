import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useStore, isOverdue } from "../../lib/store";
import { PageHeader, SectionTitle } from "../../components/PageHeader";
import { StatTile } from "../../components/ui/StatTile";
import { JobCard } from "../../components/JobCard";
import { EmptyState } from "../../components/ui/EmptyState";

export function ManagerOverview() {
  const { state } = useStore();

  const { openCount, needsTriage, overdueCount, closedCount, needsAttention } = useMemo(() => {
    const openCount = state.jobs.filter((j) => !["closed", "declined"].includes(j.status)).length;
    const needsTriage = state.jobs.filter((j) => j.status === "reported");
    const overdue = state.jobs.filter(isOverdue);
    const closedCount = state.jobs.filter((j) => j.status === "closed").length;
    const needsAttention = [...needsTriage, ...overdue.filter((j) => j.status !== "reported")]
      .slice(0, 4);
    return { openCount, needsTriage, overdueCount: overdue.length, closedCount, needsAttention };
  }, [state.jobs]);

  return (
    <div>
      <PageHeader title="Overview" description="Everything moving across your portfolio, at a glance." />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatTile value={openCount} label="Open jobs" />
        <StatTile value={needsTriage.length} label="Awaiting triage" tone={needsTriage.length ? "warn" : "default"} />
        <StatTile value={overdueCount} label="Overdue vs. SLA" tone={overdueCount ? "danger" : "default"} />
        <StatTile value={closedCount} label="Closed" />
      </div>

      <SectionTitle title="Needs your attention" count={needsAttention.length} />
      {needsAttention.length ? (
        <div className="flex flex-col gap-4">
          {needsAttention.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <EmptyState>Nothing urgent right now — check the Triage Queue for new reports.</EmptyState>
      )}

      <p className="mt-6 text-sm text-body">
        <Link to="/manager/triage" className="font-semibold text-accent hover:underline">
          Go to Triage Queue →
        </Link>
      </p>
    </div>
  );
}
