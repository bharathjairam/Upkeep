import { useState } from "react";
import type { Job } from "../lib/types";
import { useStore } from "../lib/store";
import { Field, Input, Textarea } from "./ui/Field";
import { Button } from "./ui/Button";

export function AcceptForm({ job }: { job: Job }) {
  const { vendorAccept } = useStore();
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  const [date, setDate] = useState(tomorrow);

  return (
    <div className="mt-4 flex flex-col gap-3 rounded-xl bg-surface-subtle p-4 sm:flex-row sm:items-end">
      <div className="flex-1">
        <Field label="Schedule visit">
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </Field>
      </div>
      <Button onClick={() => vendorAccept(job.id, date)}>Accept &amp; schedule</Button>
    </div>
  );
}

export function CompleteForm({ job }: { job: Job }) {
  const { vendorComplete } = useStore();
  const [notes, setNotes] = useState("");
  const [cost, setCost] = useState(String(job.costEstimate ?? ""));

  return (
    <div className="mt-4 flex flex-col gap-3 rounded-xl bg-surface-subtle p-4">
      <Field label="Completion notes">
        <Textarea rows={2} placeholder="What did you do?" value={notes} onChange={(e) => setNotes(e.target.value)} />
      </Field>
      <Field label="Actual cost (£)">
        <Input type="number" min={0} step={5} value={cost} onChange={(e) => setCost(e.target.value)} />
      </Field>
      <Button
        className="self-start"
        onClick={() => vendorComplete(job.id, { notes: notes.trim() || "Job completed.", cost: Number(cost || job.costEstimate || 0) })}
      >
        Mark complete
      </Button>
    </div>
  );
}
