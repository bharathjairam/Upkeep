import { useStore } from "../../lib/store";
import { usePersona } from "../../lib/usePersona";
import { fmtDateTime } from "../../lib/format";
import { PageHeader, SectionTitle } from "../../components/PageHeader";
import { PersonaSwitcher } from "../../components/PersonaSwitcher";
import { StatTile } from "../../components/ui/StatTile";
import { EmptyState } from "../../components/ui/EmptyState";

export function VendorEarnings() {
  const { state } = useStore();
  const [vendorId, setVendorId] = usePersona("vendor", state.vendors[0].id);
  const vendor = state.vendors.find((v) => v.id === vendorId)!;

  const invoices = state.jobs
    .filter((j) => j.vendorId === vendorId && j.actualCost != null)
    .sort((a, b) => b.reportedAt - a.reportedAt);

  const paid = invoices.filter((j) => j.status === "closed");
  const pending = invoices.filter((j) => j.status === "completed");
  const totalPaid = paid.reduce((sum, j) => sum + (j.actualCost ?? 0), 0);
  const totalPending = pending.reduce((sum, j) => sum + (j.actualCost ?? 0), 0);

  return (
    <div>
      <PageHeader
        title="Earnings"
        description={`Invoices for ${vendor.name}.`}
        right={
          <PersonaSwitcher
            label="Signed in as"
            value={vendorId}
            onChange={setVendorId}
            options={state.vendors.map((v) => ({ id: v.id, label: `${v.name} (${v.trade})` }))}
          />
        }
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <StatTile value={`£${totalPaid}`} label="Paid out" />
        <StatTile value={`£${totalPending}`} label="Pending payment" tone={totalPending ? "warn" : "default"} />
        <StatTile value={invoices.length} label="Total invoices" />
      </div>

      <SectionTitle title="Invoices" count={invoices.length} />
      {invoices.length ? (
        <div className="overflow-x-auto rounded-2xl border border-border bg-surface shadow-sm">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-muted">
                <th className="px-5 py-3 font-semibold">Job</th>
                <th className="px-5 py-3 font-semibold">Date</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 text-right font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((j) => (
                <tr key={j.id} className="border-b border-border last:border-0">
                  <td className="px-5 py-3.5">
                    <span className="text-xs font-bold text-muted">{j.id}</span>{" "}
                    <span className="font-semibold text-ink">{j.category}</span>
                  </td>
                  <td className="px-5 py-3.5 text-body">{fmtDateTime(j.reportedAt)}</td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        j.status === "closed" ? "bg-success-soft text-success-ink" : "bg-warning-soft text-warning-ink"
                      }`}
                    >
                      {j.status === "closed" ? "Paid" : "Pending"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right font-semibold text-ink">£{j.actualCost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState>No invoices yet.</EmptyState>
      )}
    </div>
  );
}
