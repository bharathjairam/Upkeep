import { useLandlordScope } from "../../lib/useLandlordScope";
import { PageHeader, SectionTitle } from "../../components/PageHeader";
import { PersonaSwitcher } from "../../components/PersonaSwitcher";
import { StatTile } from "../../components/ui/StatTile";
import { BarList } from "../../components/ui/BarList";
import { fmtDateTime } from "../../lib/format";

export function LandlordFinancials() {
  const { landlordId, setLandlordId, landlords, properties, jobs } = useLandlordScope();

  const transactions = jobs.filter((j) => j.actualCost != null).sort((a, b) => b.reportedAt - a.reportedAt);
  const totalSpend = transactions.reduce((sum, j) => sum + (j.actualCost ?? 0), 0);
  const thisMonth = transactions.filter((j) => j.reportedAt > Date.now() - 30 * 24 * 3600 * 1000);
  const spendByProperty = properties.map((p) => ({
    label: p.address.split(",")[0],
    value: transactions.filter((j) => j.propertyId === p.id).reduce((sum, j) => sum + (j.actualCost ?? 0), 0),
  }));

  return (
    <div>
      <PageHeader
        title="Financials"
        description="Spend across your portfolio, job by job."
        right={
          landlords.length > 1 ? (
            <PersonaSwitcher label="Signed in as" value={landlordId} onChange={setLandlordId} options={landlords.map((l) => ({ id: l.id, label: l.name }))} />
          ) : undefined
        }
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatTile value={`£${totalSpend}`} label="Total spend" />
        <StatTile value={`£${thisMonth.reduce((s, j) => s + (j.actualCost ?? 0), 0)}`} label="Last 30 days" />
        <StatTile value={transactions.length} label="Paid jobs" />
        <StatTile value={`£${transactions.length ? Math.round(totalSpend / transactions.length) : 0}`} label="Avg. per job" />
      </div>

      <SectionTitle title="Spend by property" count={properties.length} />
      <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
        <BarList items={spendByProperty} />
      </div>

      <SectionTitle title="Transactions" count={transactions.length} />
      <div className="overflow-x-auto rounded-2xl border border-border bg-surface shadow-sm">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wide text-muted">
              <th className="px-5 py-3 font-semibold">Job</th>
              <th className="px-5 py-3 font-semibold">Property</th>
              <th className="px-5 py-3 font-semibold">Date</th>
              <th className="px-5 py-3 text-right font-semibold">Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((j) => {
              const property = properties.find((p) => p.id === j.propertyId)!;
              return (
                <tr key={j.id} className="border-b border-border last:border-0">
                  <td className="px-5 py-3.5">
                    <span className="text-xs font-bold text-muted">{j.id}</span>{" "}
                    <span className="font-semibold text-ink">{j.category}</span>
                  </td>
                  <td className="px-5 py-3.5 text-body">{property.address}</td>
                  <td className="px-5 py-3.5 text-body">{fmtDateTime(j.reportedAt)}</td>
                  <td className="px-5 py-3.5 text-right font-semibold text-ink">£{j.actualCost}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
