import { Link } from "react-router-dom";
import { useStore } from "../../lib/store";
import { useLandlordScope } from "../../lib/useLandlordScope";
import { PageHeader, SectionTitle } from "../../components/PageHeader";
import { PersonaSwitcher } from "../../components/PersonaSwitcher";
import { StatTile } from "../../components/ui/StatTile";
import { JobCard } from "../../components/JobCard";
import { ApprovalActions } from "../../components/ApprovalActions";
import { EmptyState } from "../../components/ui/EmptyState";
import { ArrowRight } from "lucide-react";

function worstCompliance(daysLeftList: number[]) {
  if (daysLeftList.some((d) => d < 0)) return { dot: "bg-critical", label: "action needed" };
  if (daysLeftList.some((d) => d <= 30)) return { dot: "bg-warning", label: "renewal due soon" };
  return { dot: "bg-success", label: "up to date" };
}

export function LandlordOverview() {
  const { state } = useStore();
  const { landlordId, setLandlordId, landlord, landlords, properties, jobs } = useLandlordScope();

  const needsApproval = jobs.filter((j) => j.status === "awaiting_approval");
  const openJobs = jobs.filter((j) => !["closed", "declined"].includes(j.status)).length;
  const spend = jobs.filter((j) => j.actualCost != null).reduce((sum, j) => sum + (j.actualCost ?? 0), 0);

  return (
    <div>
      <PageHeader
        title={`Welcome, ${landlord?.name.split(" ")[0] ?? "there"}`}
        description="Everything across your portfolio that needs a look."
        right={
          landlords.length > 1 ? (
            <PersonaSwitcher label="Signed in as" value={landlordId} onChange={setLandlordId} options={landlords.map((l) => ({ id: l.id, label: l.name }))} />
          ) : undefined
        }
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatTile value={properties.length} label="Properties" />
        <StatTile value={openJobs} label="Open jobs" />
        <StatTile value={needsApproval.length} label="Approvals needed" tone={needsApproval.length ? "warn" : "default"} />
        <StatTile value={`£${spend}`} label="Spent (completed jobs)" />
      </div>

      <SectionTitle title="Needs your approval" count={needsApproval.length} />
      {needsApproval.length ? (
        <div className="flex flex-col gap-4">
          {needsApproval.map((job) => (
            <JobCard key={job.id} job={job}>
              <ApprovalActions job={job} />
            </JobCard>
          ))}
        </div>
      ) : (
        <EmptyState>Nothing waiting on your approval right now.</EmptyState>
      )}

      <SectionTitle title="Compliance at a glance" count={properties.length} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {properties.map((p) => {
          const daysLeftList = state.compliance.filter((c) => c.propertyId === p.id).map((c) => c.daysLeft);
          const tone = worstCompliance(daysLeftList);
          return (
            <div key={p.id} className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
              <h3 className="text-sm font-bold text-ink">{p.address}</h3>
              <span className="mt-2 flex items-center gap-1.5 text-sm text-body">
                <span className={`h-2 w-2 rounded-full ${tone.dot}`} /> {tone.label}
              </span>
            </div>
          );
        })}
      </div>
      <Link to="/landlord/documents" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-accent-dark hover:underline">
        View all documents <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
