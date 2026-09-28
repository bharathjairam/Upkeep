import { useStore } from "../../lib/store";
import { usePersona } from "../../lib/usePersona";
import { PageHeader, SectionTitle } from "../../components/PageHeader";
import { PersonaSwitcher } from "../../components/PersonaSwitcher";
import { JobCard } from "../../components/JobCard";
import { EmptyState } from "../../components/ui/EmptyState";
import { Button } from "../../components/ui/Button";

export function TenantMyIssues() {
  const { state, tenantConfirm, tenantReopen } = useStore();
  const [propertyId, setPropertyId] = usePersona("tenant-property", state.properties[0].id);

  const myJobs = state.jobs.filter((j) => j.propertyId === propertyId).sort((a, b) => b.reportedAt - a.reportedAt);
  const property = state.properties.find((p) => p.id === propertyId)!;

  return (
    <div>
      <PageHeader
        title="My Issues"
        description={`Everything reported for ${property.address}.`}
        right={
          <PersonaSwitcher
            label="Viewing as"
            value={propertyId}
            onChange={setPropertyId}
            options={state.properties.map((p) => ({ id: p.id, label: `${p.tenant} — ${p.address}` }))}
          />
        }
      />

      <SectionTitle title="Reported issues" count={myJobs.length} />
      {myJobs.length ? (
        <div className="flex flex-col gap-4">
          {myJobs.map((job) => (
            <JobCard key={job.id} job={job}>
              {job.status === "completed" && (
                <div className="mt-4 flex gap-2">
                  <Button onClick={() => tenantConfirm(job.id)}>✅ Confirm fixed</Button>
                  <Button variant="secondary" onClick={() => tenantReopen(job.id)}>
                    ⚠️ Still not fixed
                  </Button>
                </div>
              )}
            </JobCard>
          ))}
        </div>
      ) : (
        <EmptyState>You haven't reported anything yet.</EmptyState>
      )}
    </div>
  );
}
