import { useState } from "react";
import { useStore } from "../../lib/store";
import { PageHeader, SectionTitle } from "../../components/PageHeader";
import { Field, Input, Select } from "../../components/ui/Field";
import { Button } from "../../components/ui/Button";
import { Plus, Trash2 } from "lucide-react";

function worstCompliance(daysLeftList: number[]) {
  if (daysLeftList.some((d) => d < 0)) return { dot: "bg-critical", label: "action needed" };
  if (daysLeftList.some((d) => d <= 30)) return { dot: "bg-warning", label: "renewal due soon" };
  return { dot: "bg-success", label: "up to date" };
}

function AddPropertyForm({ onDone }: { onDone: () => void }) {
  const { state, addProperty } = useStore();
  const [address, setAddress] = useState("");
  const [landlordId, setLandlordId] = useState(state.landlords[0]?.id ?? "");
  const [tenant, setTenant] = useState("");
  const [tenancyStart, setTenancyStart] = useState(new Date().toISOString().slice(0, 10));

  function submit() {
    if (!address.trim() || !tenant.trim() || !landlordId) return;
    addProperty({ address: address.trim(), landlordId, tenant: tenant.trim(), tenancyStart: new Date(tenancyStart).getTime() });
    onDone();
  }

  return (
    <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-border bg-surface p-5 shadow-sm">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="Address">
          <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="14 Willow Court, Leeds" />
        </Field>
        <Field label="Landlord">
          <Select value={landlordId} onChange={(e) => setLandlordId(e.target.value)}>
            {state.landlords.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Tenant">
          <Input value={tenant} onChange={(e) => setTenant(e.target.value)} placeholder="Full name" />
        </Field>
        <Field label="Tenancy start">
          <Input type="date" value={tenancyStart} onChange={(e) => setTenancyStart(e.target.value)} />
        </Field>
      </div>
      <div className="flex gap-2">
        <Button onClick={submit} disabled={!state.landlords.length}>
          Add property
        </Button>
        <Button variant="secondary" onClick={onDone}>
          Cancel
        </Button>
      </div>
      {!state.landlords.length && <p className="text-xs text-warning-ink">Add a landlord first, on the Landlords page.</p>}
    </div>
  );
}

export function ManagerProperties() {
  const { state, getLandlord, deleteProperty } = useStore();
  const [adding, setAdding] = useState(false);

  function handleDelete(id: string, address: string) {
    if (!confirm(`Delete ${address}? This can't be undone.`)) return;
    const result = deleteProperty(id);
    if (!result.ok) alert(result.reason);
  }

  return (
    <div>
      <PageHeader
        title="Properties"
        description="Every property under management, across all landlords."
        right={
          !adding ? (
            <Button onClick={() => setAdding(true)}>
              <Plus className="h-4 w-4" /> Add property
            </Button>
          ) : undefined
        }
      />

      {adding && <AddPropertyForm onDone={() => setAdding(false)} />}

      <SectionTitle title="Portfolio" count={state.properties.length} />
      <div className="overflow-x-auto rounded-2xl border border-border bg-surface shadow-sm">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wide text-muted">
              <th className="px-5 py-3 font-semibold">Property</th>
              <th className="px-5 py-3 font-semibold">Landlord</th>
              <th className="px-5 py-3 font-semibold">Tenant</th>
              <th className="px-5 py-3 font-semibold">Open jobs</th>
              <th className="px-5 py-3 font-semibold">Compliance</th>
              <th className="px-5 py-3 font-semibold"></th>
            </tr>
          </thead>
          <tbody>
            {state.properties.map((p) => {
              const openJobs = state.jobs.filter((j) => j.propertyId === p.id && !["closed", "declined"].includes(j.status)).length;
              const daysLeftList = state.compliance.filter((c) => c.propertyId === p.id).map((c) => c.daysLeft);
              const tone = worstCompliance(daysLeftList);
              return (
                <tr key={p.id} className="border-b border-border last:border-0">
                  <td className="px-5 py-3.5 font-semibold text-ink">{p.address}</td>
                  <td className="px-5 py-3.5 text-body">{getLandlord(p.landlordId)?.name ?? "—"}</td>
                  <td className="px-5 py-3.5 text-body">{p.tenant}</td>
                  <td className="px-5 py-3.5">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${openJobs ? "bg-accent-soft text-accent-dark" : "bg-surface-subtle text-muted"}`}>
                      {openJobs}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="flex items-center gap-1.5 text-body">
                      <span className={`h-2 w-2 rounded-full ${tone.dot}`} /> {tone.label}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button onClick={() => handleDelete(p.id, p.address)} className="text-muted hover:text-critical-ink" aria-label="Delete property">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
