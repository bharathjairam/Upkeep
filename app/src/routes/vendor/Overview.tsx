import { Link } from "react-router-dom";
import { useStore } from "../../lib/store";
import { usePersona } from "../../lib/usePersona";
import { PageHeader, SectionTitle } from "../../components/PageHeader";
import { PersonaSwitcher } from "../../components/PersonaSwitcher";
import { StatTile } from "../../components/ui/StatTile";
import { JobCard } from "../../components/JobCard";
import { AcceptForm, CompleteForm } from "../../components/VendorJobActions";
import { EmptyState } from "../../components/ui/EmptyState";
import { ArrowRight } from "lucide-react";

export function VendorOverview() {
  const { state } = useStore();
  const [vendorId, setVendorId] = usePersona("vendor", state.vendors[0].id);
  const vendor = state.vendors.find((v) => v.id === vendorId)!;

  const newJobs = state.jobs.filter((j) => j.vendorId === vendorId && j.status === "assigned");
  const activeJobs = state.jobs.filter((j) => j.vendorId === vendorId && j.status === "in_progress");
  const completed = state.jobs.filter((j) => j.vendorId === vendorId && ["completed", "closed"].includes(j.status));
  const paidOut = state.jobs
    .filter((j) => j.vendorId === vendorId && j.status === "closed")
    .reduce((sum, j) => sum + (j.actualCost ?? 0), 0);

  return (
    <div>
      <PageHeader
        title={`Welcome, ${vendor.name}`}
        description="What's waiting on you right now."
        right={
          <PersonaSwitcher
            label="Signed in as"
            value={vendorId}
            onChange={setVendorId}
            options={state.vendors.map((v) => ({ id: v.id, label: `${v.name} (${v.trade})` }))}
          />
        }
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatTile value={newJobs.length} label="New jobs" tone={newJobs.length ? "warn" : "default"} />
        <StatTile value={activeJobs.length} label="Active jobs" />
        <StatTile value={completed.length} label="Completed" />
        <StatTile value={`£${paidOut}`} label="Paid out" />
      </div>

      <SectionTitle title="Needs your attention" count={newJobs.length + activeJobs.length} />
      {newJobs.length + activeJobs.length ? (
        <div className="flex flex-col gap-4">
          {newJobs.map((job) => (
            <JobCard key={job.id} job={job}>
              <AcceptForm job={job} />
            </JobCard>
          ))}
          {activeJobs.map((job) => (
            <JobCard key={job.id} job={job}>
              <CompleteForm job={job} />
            </JobCard>
          ))}
        </div>
      ) : (
        <EmptyState>Nothing waiting on you right now — check back later.</EmptyState>
      )}

      <Link to="/vendor/earnings" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent-dark hover:underline">
        View earnings <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
