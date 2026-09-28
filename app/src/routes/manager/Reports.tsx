import { useMemo } from "react";
import { useStore, isOverdue } from "../../lib/store";
import { STATUS_META } from "../../lib/meta";
import { PageHeader, SectionTitle } from "../../components/PageHeader";
import { StatTile } from "../../components/ui/StatTile";
import { BarList } from "../../components/ui/BarList";

export function ManagerReports() {
  const { state } = useStore();

  const { totalSpend, avgCost, slaRate, byCategory, byStatus } = useMemo(() => {
    const withCost = state.jobs.filter((j) => j.actualCost != null);
    const totalSpend = withCost.reduce((sum, j) => sum + (j.actualCost ?? 0), 0);
    const avgCost = withCost.length ? Math.round(totalSpend / withCost.length) : 0;

    const relevant = state.jobs.filter((j) => j.status !== "declined");
    const overdueCount = relevant.filter(isOverdue).length;
    const slaRate = relevant.length ? Math.round(((relevant.length - overdueCount) / relevant.length) * 100) : 100;

    const categoryCounts = new Map<string, number>();
    for (const j of state.jobs) categoryCounts.set(j.category, (categoryCounts.get(j.category) ?? 0) + 1);
    const byCategory = [...categoryCounts.entries()].map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);

    const statusCounts = new Map<string, number>();
    for (const j of state.jobs) statusCounts.set(j.status, (statusCounts.get(j.status) ?? 0) + 1);
    const byStatus = [...statusCounts.entries()]
      .map(([status, value]) => ({ label: STATUS_META[status as keyof typeof STATUS_META].label, value }))
      .sort((a, b) => b.value - a.value);

    return { totalSpend, avgCost, slaRate, byCategory, byStatus };
  }, [state.jobs]);

  return (
    <div>
      <PageHeader title="Reports" description="Portfolio-wide trends across every job you manage." />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatTile value={state.jobs.length} label="Total jobs" />
        <StatTile value={`£${totalSpend}`} label="Total spend" />
        <StatTile value={`£${avgCost}`} label="Avg. cost per job" />
        <StatTile value={`${slaRate}%`} label="SLA compliance" tone={slaRate < 80 ? "warn" : "default"} />
      </div>

      <SectionTitle title="Jobs by category" count={byCategory.length} />
      <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
        <BarList items={byCategory} />
      </div>

      <SectionTitle title="Jobs by status" count={byStatus.length} />
      <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
        <BarList items={byStatus} />
      </div>
    </div>
  );
}
