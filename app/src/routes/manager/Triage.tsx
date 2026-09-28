import { useState } from "react";
import { APPROVAL_THRESHOLD, useStore } from "../../lib/store";
import type { Job, Urgency } from "../../lib/types";
import { PageHeader, SectionTitle } from "../../components/PageHeader";
import { JobCard } from "../../components/JobCard";
import { EmptyState } from "../../components/ui/EmptyState";
import { Field, Select, Input } from "../../components/ui/Field";
import { Button } from "../../components/ui/Button";

function TriageForm({ job }: { job: Job }) {
  const { state, triageAndRoute } = useStore();
  const [urgency, setUrgency] = useState<Urgency>(job.urgency);
  const [cost, setCost] = useState("");
  const [vendorId, setVendorId] = useState(state.vendors[0]?.id ?? "");
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <div className="mt-3">
        <Button variant="primary" onClick={() => setOpen(true)}>
          Triage this job
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-4 flex flex-col gap-3 rounded-xl bg-surface-subtle p-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Field label="Urgency">
          <Select value={urgency} onChange={(e) => setUrgency(e.target.value as Urgency)}>
            <option value="emergency">Emergency (4h SLA)</option>
            <option value="urgent">Urgent (24h SLA)</option>
            <option value="routine">Routine (5 day SLA)</option>
          </Select>
        </Field>
        <Field label="Estimated cost (£)">
          <Input type="number" min={0} step={5} placeholder="e.g. 120" value={cost} onChange={(e) => setCost(e.target.value)} />
        </Field>
        <Field label={`Vendor (if under £${APPROVAL_THRESHOLD})`}>
          <Select value={vendorId} onChange={(e) => setVendorId(e.target.value)}>
            {state.vendors.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name} — {v.trade}
              </option>
            ))}
          </Select>
        </Field>
      </div>
      <Button
        onClick={() => {
          triageAndRoute(job.id, { urgency, cost: Number(cost || 0), vendorId });
          setOpen(false);
        }}
      >
        Save triage &amp; route
      </Button>
      <p className="text-xs text-body">
        Under £{APPROVAL_THRESHOLD} auto-assigns the vendor you pick. £{APPROVAL_THRESHOLD}+ sends it to the landlord for approval first.
      </p>
    </div>
  );
}

export function ManagerTriage() {
  const { state } = useStore();
  const needsTriage = state.jobs.filter((j) => j.status === "reported");

  return (
    <div>
      <PageHeader title="Triage Queue" description="New reports land here first. Set urgency and cost, then route them." />
      <SectionTitle title="Needs triage" count={needsTriage.length} />
      {needsTriage.length ? (
        <div className="flex flex-col gap-4">
          {needsTriage.map((job) => (
            <JobCard key={job.id} job={job}>
              <TriageForm job={job} />
            </JobCard>
          ))}
        </div>
      ) : (
        <EmptyState>No new reports waiting on you.</EmptyState>
      )}
    </div>
  );
}
