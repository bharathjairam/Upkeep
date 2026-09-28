import { useState } from "react";
import { useStore } from "../../lib/store";
import type { Job } from "../../lib/types";
import { PageHeader, SectionTitle } from "../../components/PageHeader";
import { JobCard } from "../../components/JobCard";
import { EmptyState } from "../../components/ui/EmptyState";
import { Field, Select } from "../../components/ui/Field";
import { Button } from "../../components/ui/Button";

function AssignVendorForm({ job }: { job: Job }) {
  const { state, assignVendor } = useStore();
  const [vendorId, setVendorId] = useState(state.vendors[0]?.id ?? "");

  return (
    <div className="mt-4 flex flex-col gap-3 rounded-xl bg-surface-subtle p-4 sm:flex-row sm:items-end">
      <div className="flex-1">
        <Field label="Assign vendor">
          <Select value={vendorId} onChange={(e) => setVendorId(e.target.value)}>
            {state.vendors.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name} — {v.trade}
              </option>
            ))}
          </Select>
        </Field>
      </div>
      <Button onClick={() => assignVendor(job.id, vendorId)}>Assign vendor</Button>
    </div>
  );
}

export function ManagerApprovals() {
  const { state } = useStore();
  const waitingOnLandlord = state.jobs.filter((j) => j.status === "awaiting_approval");
  const needsVendor = state.jobs.filter((j) => j.status === "approved");

  return (
    <div>
      <PageHeader title="Approvals" description="High-cost jobs waiting on a landlord, and approved jobs waiting on you." />

      <SectionTitle title="Waiting on landlord" count={waitingOnLandlord.length} />
      {waitingOnLandlord.length ? (
        <div className="flex flex-col gap-4">
          {waitingOnLandlord.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <EmptyState>Nothing sent to a landlord right now.</EmptyState>
      )}

      <SectionTitle title="Approved — needs a vendor" count={needsVendor.length} />
      {needsVendor.length ? (
        <div className="flex flex-col gap-4">
          {needsVendor.map((job) => (
            <JobCard key={job.id} job={job}>
              <AssignVendorForm job={job} />
            </JobCard>
          ))}
        </div>
      ) : (
        <EmptyState>Nothing waiting on vendor assignment.</EmptyState>
      )}
    </div>
  );
}
