import { useState } from "react";
import { useStore } from "../../lib/store";
import { useLandlordScope } from "../../lib/useLandlordScope";
import { PageHeader, SectionTitle } from "../../components/PageHeader";
import { PersonaSwitcher } from "../../components/PersonaSwitcher";
import { StatTile } from "../../components/ui/StatTile";
import { Field, Input } from "../../components/ui/Field";
import { Button } from "../../components/ui/Button";
import { Plus, Trash2 } from "lucide-react";

function fmtDate(ts: number) {
  return new Date(ts).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function AddPropertyForm({ landlordId, onDone }: { landlordId: string; onDone: () => void }) {
  const { addProperty } = useStore();
  const [address, setAddress] = useState("");
  const [tenant, setTenant] = useState("");
  const [tenancyStart, setTenancyStart] = useState(new Date().toISOString().slice(0, 10));

  function submit() {
    if (!address.trim() || !tenant.trim()) return;
    addProperty({ address: address.trim(), landlordId, tenant: tenant.trim(), tenancyStart: new Date(tenancyStart).getTime() });
    onDone();
  }

  return (
    <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-border bg-surface p-5 shadow-sm">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Field label="Address">
          <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="14 Willow Court, Leeds" />
        </Field>
        <Field label="Tenant">
          <Input value={tenant} onChange={(e) => setTenant(e.target.value)} placeholder="Full name" />
        </Field>
        <Field label="Tenancy start">
          <Input type="date" value={tenancyStart} onChange={(e) => setTenancyStart(e.target.value)} />
        </Field>
      </div>
      <div className="flex gap-2">
        <Button onClick={submit}>Add property</Button>
        <Button variant="secondary" onClick={onDone}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

export function LandlordPortfolio() {
  const { deleteProperty } = useStore();
  const { landlordId, setLandlordId, landlords, properties, jobs } = useLandlordScope();
  const [adding, setAdding] = useState(false);
  const openJobs = jobs.filter((j) => !["closed", "declined"].includes(j.status)).length;
  const inProgress = jobs.filter((j) => j.status === "in_progress").length;

  function handleDelete(id: string, address: string) {
    if (!confirm(`Remove ${address} from your portfolio? This can't be undone.`)) return;
    const result = deleteProperty(id);
    if (!result.ok) alert(result.reason);
  }

  return (
    <div>
      <PageHeader
        title="Portfolio"
        description="Every property you own, managed day-to-day by Bright Lettings."
        right={
          <div className="flex flex-wrap items-center gap-3">
            {landlords.length > 1 && (
              <PersonaSwitcher label="Signed in as" value={landlordId} onChange={setLandlordId} options={landlords.map((l) => ({ id: l.id, label: l.name }))} />
            )}
            {!adding && (
              <Button onClick={() => setAdding(true)}>
                <Plus className="h-4 w-4" /> Add property
              </Button>
            )}
          </div>
        }
      />

      {adding && <AddPropertyForm landlordId={landlordId} onDone={() => setAdding(false)} />}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatTile value={properties.length} label="Properties" />
        <StatTile value={openJobs} label="Open jobs" />
        <StatTile value={inProgress} label="Vendors on site" />
        <StatTile value={new Set(properties.map((p) => p.tenant)).size} label="Tenancies" />
      </div>

      <SectionTitle title="Properties" count={properties.length} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {properties.map((p) => {
          const propJobs = jobs.filter((j) => j.propertyId === p.id);
          const open = propJobs.filter((j) => !["closed", "declined"].includes(j.status)).length;
          return (
            <div key={p.id} className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold text-ink">{p.address}</h3>
                <button onClick={() => handleDelete(p.id, p.address)} className="shrink-0 text-muted hover:text-critical-ink" aria-label="Remove property">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-1 text-sm text-body">Tenant: {p.tenant}</p>
              <p className="text-sm text-body">Tenancy since {fmtDate(p.tenancyStart)}</p>
              <div className="mt-3 border-t border-border pt-3 text-sm">
                <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${open ? "bg-accent-soft text-accent-dark" : "bg-surface-subtle text-muted"}`}>
                  {open} open job{open === 1 ? "" : "s"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
