import { useState } from "react";
import { useStore } from "../../lib/store";
import { PageHeader, SectionTitle } from "../../components/PageHeader";
import { Field, Input } from "../../components/ui/Field";
import { Button } from "../../components/ui/Button";
import { Plus, Trash2 } from "lucide-react";

function AddLandlordForm({ onDone }: { onDone: () => void }) {
  const { addLandlord } = useStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  function submit() {
    if (!name.trim()) return;
    addLandlord({ name: name.trim(), email: email.trim() || "Not set", phone: phone.trim() || "Not set" });
    onDone();
  }

  return (
    <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-border bg-surface p-5 shadow-sm">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Field label="Name">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
        </Field>
        <Field label="Email">
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" />
        </Field>
        <Field label="Phone">
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="07700 900000" />
        </Field>
      </div>
      <div className="flex gap-2">
        <Button onClick={submit}>Add landlord</Button>
        <Button variant="secondary" onClick={onDone}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

export function ManagerLandlords() {
  const { state, deleteLandlord } = useStore();
  const [adding, setAdding] = useState(false);

  function handleDelete(id: string, name: string) {
    if (!confirm(`Remove ${name} from your landlord directory?`)) return;
    const result = deleteLandlord(id);
    if (!result.ok) alert(result.reason);
  }

  return (
    <div>
      <PageHeader
        title="Landlords"
        description="Everyone your team reports spend and approvals to."
        right={
          !adding ? (
            <Button onClick={() => setAdding(true)}>
              <Plus className="h-4 w-4" /> Add landlord
            </Button>
          ) : undefined
        }
      />

      {adding && <AddLandlordForm onDone={() => setAdding(false)} />}

      <SectionTitle title="Directory" count={state.landlords.length} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {state.landlords.map((landlord) => {
          const properties = state.properties.filter((p) => p.landlordId === landlord.id);
          const propertyIds = properties.map((p) => p.id);
          const jobs = state.jobs.filter((j) => propertyIds.includes(j.propertyId));
          const openJobs = jobs.filter((j) => !["closed", "declined"].includes(j.status)).length;
          const needsApproval = jobs.filter((j) => j.status === "awaiting_approval").length;
          const spend = jobs.filter((j) => j.actualCost != null).reduce((sum, j) => sum + (j.actualCost ?? 0), 0);

          return (
            <div key={landlord.id} className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-ink">{landlord.name}</h3>
                  <p className="text-xs text-body">{landlord.email} · {landlord.phone}</p>
                  <p className="mt-1 text-sm text-body">
                    {properties.length} propert{properties.length === 1 ? "y" : "ies"}
                  </p>
                </div>
                <button onClick={() => handleDelete(landlord.id, landlord.name)} className="text-muted hover:text-critical-ink" aria-label="Delete landlord">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <ul className="mt-2 space-y-0.5 text-sm text-body">
                {properties.map((p) => (
                  <li key={p.id}>· {p.address}</li>
                ))}
              </ul>
              <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-3 text-center">
                <div>
                  <div className="text-base font-bold text-ink">{openJobs}</div>
                  <div className="text-[11px] text-body">Open jobs</div>
                </div>
                <div>
                  <div className={`text-base font-bold ${needsApproval ? "text-warning-ink" : "text-ink"}`}>{needsApproval}</div>
                  <div className="text-[11px] text-body">Awaiting them</div>
                </div>
                <div>
                  <div className="text-base font-bold text-ink">£{spend}</div>
                  <div className="text-[11px] text-body">Total spend</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
