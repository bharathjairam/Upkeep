import { useState } from "react";
import type { Job } from "../lib/types";
import { useStore } from "../lib/store";
import { Input } from "./ui/Field";
import { Button } from "./ui/Button";

export function ApprovalActions({ job }: { job: Job }) {
  const { landlordApprove, landlordDecline } = useStore();
  const [declining, setDeclining] = useState(false);
  const [reason, setReason] = useState("");

  return (
    <div className="mt-4">
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => landlordApprove(job.id)}>Approve £{job.costEstimate}</Button>
        <Button variant="secondary" onClick={() => setDeclining((v) => !v)}>
          {declining ? "Cancel decline" : "Decline…"}
        </Button>
      </div>
      {declining && (
        <div className="mt-3 flex flex-col gap-2 rounded-xl bg-surface-subtle p-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Input placeholder="Reason (optional) — e.g. tenant to arrange and self-fund" value={reason} onChange={(e) => setReason(e.target.value)} />
          </div>
          <Button variant="secondary" onClick={() => landlordDecline(job.id, reason)}>
            Confirm decline
          </Button>
        </div>
      )}
    </div>
  );
}
