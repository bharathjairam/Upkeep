import { useState } from "react";
import { useStore } from "../../lib/store";
import { PageHeader, SectionTitle } from "../../components/PageHeader";
import { Stars } from "../../components/ui/Stars";
import { Field, Input } from "../../components/ui/Field";
import { Button } from "../../components/ui/Button";
import { Plus, Trash2 } from "lucide-react";

function AddVendorForm({ onDone }: { onDone: () => void }) {
  const { addVendor } = useStore();
  const [name, setName] = useState("");
  const [trade, setTrade] = useState("");
  const [serviceArea, setServiceArea] = useState("");
  const [contact, setContact] = useState("");

  function submit() {
    if (!name.trim() || !trade.trim()) return;
    addVendor({ name: name.trim(), trade: trade.trim(), rating: 5, serviceArea: serviceArea.trim() || "Not set", contact: contact.trim() || "Not set" });
    onDone();
  }

  return (
    <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-border bg-surface p-5 shadow-sm">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="Vendor name">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Speedy Roofing Ltd." />
        </Field>
        <Field label="Trade">
          <Input value={trade} onChange={(e) => setTrade(e.target.value)} placeholder="Roofing" />
        </Field>
        <Field label="Service area">
          <Input value={serviceArea} onChange={(e) => setServiceArea(e.target.value)} placeholder="Manchester & Leeds" />
        </Field>
        <Field label="Contact">
          <Input value={contact} onChange={(e) => setContact(e.target.value)} placeholder="0161 555 0100" />
        </Field>
      </div>
      <div className="flex gap-2">
        <Button onClick={submit}>Add vendor</Button>
        <Button variant="secondary" onClick={onDone}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

export function ManagerVendors() {
  const { state, deleteVendor } = useStore();
  const [adding, setAdding] = useState(false);

  function handleDelete(id: string, name: string) {
    if (!confirm(`Remove ${name} from your vendor directory?`)) return;
    const result = deleteVendor(id);
    if (!result.ok) alert(result.reason);
  }

  return (
    <div>
      <PageHeader
        title="Vendors"
        description="Contractors your team can assign jobs to."
        right={
          !adding ? (
            <Button onClick={() => setAdding(true)}>
              <Plus className="h-4 w-4" /> Add vendor
            </Button>
          ) : undefined
        }
      />

      {adding && <AddVendorForm onDone={() => setAdding(false)} />}

      <SectionTitle title="Directory" count={state.vendors.length} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {state.vendors.map((v) => {
          const vendorJobs = state.jobs.filter((j) => j.vendorId === v.id);
          const completed = vendorJobs.filter((j) => ["completed", "closed"].includes(j.status));
          const active = vendorJobs.filter((j) => ["assigned", "in_progress"].includes(j.status));
          const costs = completed.map((j) => j.actualCost).filter((c): c is number => c != null);
          const avgCost = costs.length ? Math.round(costs.reduce((a, b) => a + b, 0) / costs.length) : null;

          return (
            <div key={v.id} className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-ink">{v.name}</h3>
                  <p className="text-sm text-body">{v.trade}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Stars rating={v.rating} />
                  <button onClick={() => handleDelete(v.id, v.name)} className="text-muted hover:text-critical-ink" aria-label="Delete vendor">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="mt-3 text-xs text-body">Covers {v.serviceArea}</p>
              <p className="text-xs text-body">{v.contact}</p>
              <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-3 text-center">
                <div>
                  <div className="text-base font-bold text-ink">{completed.length}</div>
                  <div className="text-[11px] text-body">Completed</div>
                </div>
                <div>
                  <div className="text-base font-bold text-ink">{active.length}</div>
                  <div className="text-[11px] text-body">Active now</div>
                </div>
                <div>
                  <div className="text-base font-bold text-ink">{avgCost != null ? `£${avgCost}` : "—"}</div>
                  <div className="text-[11px] text-body">Avg. cost</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
