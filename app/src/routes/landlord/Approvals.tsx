import { useLandlordScope } from "../../lib/useLandlordScope";
import { PageHeader, SectionTitle } from "../../components/PageHeader";
import { PersonaSwitcher } from "../../components/PersonaSwitcher";
import { JobCard } from "../../components/JobCard";
import { ApprovalActions } from "../../components/ApprovalActions";
import { EmptyState } from "../../components/ui/EmptyState";

export function LandlordApprovals() {
  const { landlordId, setLandlordId, landlords, jobs } = useLandlordScope();
  const needsApproval = jobs.filter((j) => j.status === "awaiting_approval");

  return (
    <div>
      <PageHeader
        title="Approvals"
        description="Jobs your property manager estimated above the auto-approval threshold."
        right={
          landlords.length > 1 ? (
            <PersonaSwitcher label="Signed in as" value={landlordId} onChange={setLandlordId} options={landlords.map((l) => ({ id: l.id, label: l.name }))} />
          ) : undefined
        }
      />
      <SectionTitle title="Approvals needed" count={needsApproval.length} />
      {needsApproval.length ? (
        <div className="flex flex-col gap-4">
          {needsApproval.map((job) => (
            <JobCard key={job.id} job={job}>
              <ApprovalActions job={job} />
            </JobCard>
          ))}
        </div>
      ) : (
        <EmptyState>Nothing waiting on your approval.</EmptyState>
      )}
    </div>
  );
}
