import { useStore } from "../../lib/store";
import { PageHeader, SectionTitle } from "../../components/PageHeader";
import { JobCard } from "../../components/JobCard";
import { EmptyState } from "../../components/ui/EmptyState";

export function ManagerHistory() {
  const { state } = useStore();
  const closed = state.jobs
    .filter((j) => ["closed", "declined"].includes(j.status))
    .sort((a, b) => b.reportedAt - a.reportedAt);

  return (
    <div>
      <PageHeader title="History" description="Closed and declined jobs, kept for the record." />
      <SectionTitle title="Closed & declined" count={closed.length} />
      {closed.length ? (
        <div className="flex flex-col gap-4">
          {closed.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <EmptyState>No closed jobs yet.</EmptyState>
      )}
    </div>
  );
}
