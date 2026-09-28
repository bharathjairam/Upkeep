import { useStore } from "../../lib/store";
import { useLandlordScope } from "../../lib/useLandlordScope";
import { PageHeader, SectionTitle } from "../../components/PageHeader";
import { PersonaSwitcher } from "../../components/PersonaSwitcher";
import { Button } from "../../components/ui/Button";
import { FileText } from "lucide-react";

function statusFor(daysLeft: number) {
  if (daysLeft < 0) return { label: `Expired ${Math.abs(daysLeft)}d ago`, className: "bg-critical-soft text-critical-ink" };
  if (daysLeft <= 30) return { label: `Renew in ${daysLeft}d`, className: "bg-warning-soft text-warning-ink" };
  return { label: `Valid — ${daysLeft}d left`, className: "bg-success-soft text-success-ink" };
}

function expiryDate(daysLeft: number) {
  const ts = Date.now() + daysLeft * 24 * 3600 * 1000;
  return new Date(ts).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function LandlordDocuments() {
  const { state } = useStore();
  const { landlordId, setLandlordId, landlords, properties } = useLandlordScope();

  return (
    <div>
      <PageHeader
        title="Documents"
        description="Compliance certificates for every property, in one place."
        right={
          landlords.length > 1 ? (
            <PersonaSwitcher label="Signed in as" value={landlordId} onChange={setLandlordId} options={landlords.map((l) => ({ id: l.id, label: l.name }))} />
          ) : undefined
        }
      />
      {properties.map((p) => {
        const docs = state.compliance.filter((c) => c.propertyId === p.id);
        return (
          <div key={p.id} className="mb-6">
            <SectionTitle title={p.address} count={docs.length} />
            <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
              {docs.map((d, i) => {
                const status = statusFor(d.daysLeft);
                return (
                  <div key={i} className={`flex flex-wrap items-center justify-between gap-3 px-5 py-4 ${i > 0 ? "border-t border-border" : ""}`}>
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 shrink-0 text-accent-dark" />
                      <div>
                        <div className="text-sm font-semibold text-ink">{d.item}</div>
                        <div className="text-xs text-body">Expires {expiryDate(d.daysLeft)}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${status.className}`}>{status.label}</span>
                      <Button variant="secondary" className="text-xs">
                        {d.daysLeft <= 30 ? "Start renewal" : "View certificate"}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
