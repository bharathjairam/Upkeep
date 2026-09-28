import { useStore } from "../../lib/store";
import { usePersona } from "../../lib/usePersona";
import { PageHeader, SectionTitle } from "../../components/PageHeader";
import { PersonaSwitcher } from "../../components/PersonaSwitcher";
import { JobCard } from "../../components/JobCard";
import { AcceptForm, CompleteForm } from "../../components/VendorJobActions";
import { EmptyState } from "../../components/ui/EmptyState";

export function VendorQueue() {
  const { state } = useStore();
  const [vendorId, setVendorId] = usePersona("vendor", state.vendors[0].id);
  const vendor = state.vendors.find((v) => v.id === vendorId)!;

  const newJobs = state.jobs.filter((j) => j.vendorId === vendorId && j.status === "assigned");
  const activeJobs = state.jobs.filter((j) => j.vendorId === vendorId && j.status === "in_progress");

  return (
    <div>
      <PageHeader
        title="Job Queue"
        description={`New and in-progress work assigned to ${vendor.name}.`}
        right={
          <PersonaSwitcher
            label="Signed in as"
            value={vendorId}
            onChange={setVendorId}
            options={state.vendors.map((v) => ({ id: v.id, label: `${v.name} (${v.trade})` }))}
          />
        }
      />

      <SectionTitle title="New jobs" count={newJobs.length} />
      {newJobs.length ? (
        <div className="flex flex-col gap-4">
          {newJobs.map((job) => (
            <JobCard key={job.id} job={job}>
              <AcceptForm job={job} />
            </JobCard>
          ))}
        </div>
      ) : (
        <EmptyState>No new jobs waiting.</EmptyState>
      )}

      <SectionTitle title="Active jobs" count={activeJobs.length} />
      {activeJobs.length ? (
        <div className="flex flex-col gap-4">
          {activeJobs.map((job) => (
            <JobCard key={job.id} job={job}>
              <CompleteForm job={job} />
            </JobCard>
          ))}
        </div>
      ) : (
        <EmptyState>Nothing in progress right now.</EmptyState>
      )}
    </div>
  );
}
