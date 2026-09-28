import { Link } from "react-router-dom";
import { useStore } from "../../lib/store";
import { usePersona } from "../../lib/usePersona";
import { timeAgo, fmtDateTime } from "../../lib/format";
import { PageHeader, SectionTitle } from "../../components/PageHeader";
import { PersonaSwitcher } from "../../components/PersonaSwitcher";
import { StatTile } from "../../components/ui/StatTile";
import { JobCard } from "../../components/JobCard";
import { EmptyState } from "../../components/ui/EmptyState";
import { Button } from "../../components/ui/Button";
import { Bell, ArrowRight } from "lucide-react";

export function TenantHome() {
  const { state, tenantConfirm, tenantReopen } = useStore();
  const [propertyId, setPropertyId] = usePersona("tenant-property", state.properties[0].id);
  const property = state.properties.find((p) => p.id === propertyId)!;

  const myJobs = state.jobs.filter((j) => j.propertyId === propertyId);
  const open = myJobs.filter((j) => !["closed", "declined"].includes(j.status));
  const oneMonthAgo = Date.now() - 30 * 24 * 3600 * 1000;
  const resolvedThisMonth = myJobs.filter((j) => j.status === "closed" && j.reportedAt > oneMonthAgo);
  const needsYourInput = myJobs.filter((j) => j.status === "completed");

  const recentEvents = myJobs
    .flatMap((j) => j.log.map((entry) => ({ ...entry, jobId: j.id })))
    .sort((a, b) => b.ts - a.ts)
    .slice(0, 4);

  return (
    <div>
      <PageHeader
        title={`Welcome, ${property.tenant.split(" ")[0]}`}
        description={property.address}
        right={
          <PersonaSwitcher
            label="Viewing as"
            value={propertyId}
            onChange={setPropertyId}
            options={state.properties.map((p) => ({ id: p.id, label: `${p.tenant} — ${p.address}` }))}
          />
        }
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <StatTile value={open.length} label="Open issues" />
        <StatTile value={needsYourInput.length} label="Waiting on your confirmation" tone={needsYourInput.length ? "warn" : "default"} />
        <StatTile value={resolvedThisMonth.length} label="Resolved this month" />
      </div>

      <div className="mt-6">
        <Link to="/tenant/report">
          <Button>Report a new issue</Button>
        </Link>
      </div>

      <SectionTitle title="Needs your confirmation" count={needsYourInput.length} />
      {needsYourInput.length ? (
        <div className="flex flex-col gap-4">
          {needsYourInput.map((job) => (
            <JobCard key={job.id} job={job}>
              <div className="mt-4 flex gap-2">
                <Button onClick={() => tenantConfirm(job.id)}>✅ Confirm fixed</Button>
                <Button variant="secondary" onClick={() => tenantReopen(job.id)}>
                  ⚠️ Still not fixed
                </Button>
              </div>
            </JobCard>
          ))}
        </div>
      ) : (
        <EmptyState>Nothing waiting on you right now.</EmptyState>
      )}

      <SectionTitle title="Recent activity" count={recentEvents.length} />
      {recentEvents.length ? (
        <div className="flex flex-col gap-2">
          {recentEvents.map((e, i) => (
            <div key={i} className="flex items-start gap-3 rounded-xl border border-border bg-surface px-4 py-3 shadow-sm">
              <Bell className="mt-0.5 h-4 w-4 shrink-0 text-accent-dark" />
              <div className="flex-1 text-sm text-body">
                <span className="font-semibold text-muted">{e.jobId}</span> · {e.text}
              </div>
              <div className="shrink-0 text-right text-xs text-muted" title={fmtDateTime(e.ts)}>
                {timeAgo(e.ts)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState>No activity yet.</EmptyState>
      )}
      <Link to="/tenant/notifications" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-accent-dark hover:underline">
        View all notifications <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
