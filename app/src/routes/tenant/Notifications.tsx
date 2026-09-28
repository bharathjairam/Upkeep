import { useStore } from "../../lib/store";
import { usePersona } from "../../lib/usePersona";
import { timeAgo, fmtDateTime } from "../../lib/format";
import { PageHeader, SectionTitle } from "../../components/PageHeader";
import { PersonaSwitcher } from "../../components/PersonaSwitcher";
import { EmptyState } from "../../components/ui/EmptyState";
import { Bell } from "lucide-react";

export function TenantNotifications() {
  const { state } = useStore();
  const [propertyId, setPropertyId] = usePersona("tenant-property", state.properties[0].id);

  const events = state.jobs
    .filter((j) => j.propertyId === propertyId)
    .flatMap((j) => j.log.map((entry) => ({ ...entry, jobId: j.id, category: j.category })))
    .sort((a, b) => b.ts - a.ts);

  return (
    <div>
      <PageHeader
        title="Notifications"
        description="Every update on your reported issues, newest first."
        right={
          <PersonaSwitcher
            label="Viewing as"
            value={propertyId}
            onChange={setPropertyId}
            options={state.properties.map((p) => ({ id: p.id, label: `${p.tenant} — ${p.address}` }))}
          />
        }
      />
      <SectionTitle title="Activity" count={events.length} />
      {events.length ? (
        <div className="flex flex-col gap-2">
          {events.map((e, i) => (
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
    </div>
  );
}
