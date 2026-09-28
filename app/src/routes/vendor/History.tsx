import { useStore } from "../../lib/store";
import { usePersona } from "../../lib/usePersona";
import { PageHeader, SectionTitle } from "../../components/PageHeader";
import { PersonaSwitcher } from "../../components/PersonaSwitcher";
import { JobCard } from "../../components/JobCard";
import { EmptyState } from "../../components/ui/EmptyState";

export function VendorHistory() {
  const { state } = useStore();
  const [vendorId, setVendorId] = usePersona("vendor", state.vendors[0].id);
  const vendor = state.vendors.find((v) => v.id === vendorId)!;

  const history = state.jobs
    .filter((j) => j.vendorId === vendorId && ["completed", "closed"].includes(j.status))
    .sort((a, b) => b.reportedAt - a.reportedAt);

  return (
    <div>
      <PageHeader
        title="History"
        description={`Completed work for ${vendor.name}.`}
        right={
          <PersonaSwitcher
            label="Signed in as"
            value={vendorId}
            onChange={setVendorId}
            options={state.vendors.map((v) => ({ id: v.id, label: `${v.name} (${v.trade})` }))}
          />
        }
      />
      <SectionTitle title="Completed jobs" count={history.length} />
      {history.length ? (
        <div className="flex flex-col gap-4">
          {history.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <EmptyState>No completed jobs yet.</EmptyState>
      )}
    </div>
  );
}
