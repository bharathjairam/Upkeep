import { useStore } from "../../lib/store";
import { PageHeader, SectionTitle } from "../../components/PageHeader";
import { JobCard } from "../../components/JobCard";
import { EmptyState } from "../../components/ui/EmptyState";

export function ManagerActive() {
  const { state } = useStore();
  const assigned = state.jobs.filter((j) => j.status === "assigned");
  const inProgress = state.jobs.filter((j) => j.status === "in_progress");

  return (
    <div>
      <PageHeader title="Active Jobs" description="Out with vendors right now. They'll update status as work happens." />

      <SectionTitle title="Assigned, not yet started" count={assigned.length} />
      {assigned.length ? (
        <div className="flex flex-col gap-4">
          {assigned.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <EmptyState>Nothing waiting on a vendor to start.</EmptyState>
      )}

      <SectionTitle title="In progress" count={inProgress.length} />
      {inProgress.length ? (
        <div className="flex flex-col gap-4">
          {inProgress.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <EmptyState>Nothing in progress right now.</EmptyState>
      )}
    </div>
  );
}
