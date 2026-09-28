import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { AppState, Job, Landlord, Property, Urgency, Vendor } from "./types";
import { seedState } from "./seed";
import { uid } from "./id";

export const APPROVAL_THRESHOLD = 250;
export const SLA_HOURS: Record<Urgency, number> = { emergency: 4, urgent: 24, routine: 120 };
const STORAGE_KEY = "pma_app_state_v2";

export interface ActionResult {
  ok: boolean;
  reason?: string;
}

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedState();
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.jobs) || !Array.isArray(parsed.landlords)) return seedState();
    return parsed;
  } catch {
    return seedState();
  }
}

function addLog(job: Job, text: string) {
  job.log.push({ ts: Date.now(), text });
}

interface StoreApi {
  state: AppState;
  getProperty: (id: string) => AppState["properties"][number];
  getVendor: (id: string) => AppState["vendors"][number] | undefined;
  getLandlord: (id: string) => AppState["landlords"][number] | undefined;
  getJob: (id: string) => Job | undefined;
  reportIssue: (input: { propertyId: string; category: string; urgency: Urgency; description: string; photoDataUrl: string | null }) => Job;
  triageAndRoute: (jobId: string, input: { urgency: Urgency; cost: number; vendorId: string }) => void;
  assignVendor: (jobId: string, vendorId: string) => void;
  landlordApprove: (jobId: string) => void;
  landlordDecline: (jobId: string, reason: string) => void;
  vendorAccept: (jobId: string, date: string) => void;
  vendorComplete: (jobId: string, input: { notes: string; cost: number }) => void;
  tenantConfirm: (jobId: string) => void;
  tenantReopen: (jobId: string) => void;
  addProperty: (input: Omit<Property, "id">) => void;
  deleteProperty: (id: string) => ActionResult;
  addVendor: (input: Omit<Vendor, "id">) => void;
  deleteVendor: (id: string) => ActionResult;
  addLandlord: (input: Omit<Landlord, "id">) => void;
  deleteLandlord: (id: string) => ActionResult;
  restoreSampleData: () => void;
}

const StoreContext = createContext<StoreApi | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(loadState);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // storage unavailable — in-memory state still works for this session
    }
  }, [state]);

  const api = useMemo<StoreApi>(() => {
    const mutate = (fn: (draft: AppState) => void) => {
      setState((prev) => {
        const draft: AppState = structuredClone(prev);
        fn(draft);
        return draft;
      });
    };

    return {
      state,
      getProperty: (id) => state.properties.find((p) => p.id === id)!,
      getVendor: (id) => state.vendors.find((v) => v.id === id),
      getLandlord: (id) => state.landlords.find((l) => l.id === id),
      getJob: (id) => state.jobs.find((j) => j.id === id),

      reportIssue: (input) => {
        const property = state.properties.find((p) => p.id === input.propertyId)!;
        const job: Job = {
          id: "JOB-" + state.nextSeq,
          propertyId: input.propertyId,
          category: input.category,
          urgency: input.urgency,
          description: input.description,
          status: "reported",
          costEstimate: null,
          actualCost: null,
          vendorId: null,
          photoDataUrl: input.photoDataUrl,
          reportedAt: Date.now(),
          log: [],
        };
        addLog(job, `${property.tenant} reported the issue.`);
        mutate((draft) => {
          draft.nextSeq += 1;
          draft.jobs.unshift(job);
        });
        return job;
      },

      triageAndRoute: (jobId, { urgency, cost, vendorId }) => {
        mutate((draft) => {
          const job = draft.jobs.find((j) => j.id === jobId)!;
          job.urgency = urgency;
          job.costEstimate = cost;
          if (cost > APPROVAL_THRESHOLD) {
            job.status = "awaiting_approval";
            addLog(job, `Bright Lettings triaged: ${urgency}, estimated £${cost} — over £${APPROVAL_THRESHOLD}, sent to landlord for approval.`);
          } else {
            const vendor = draft.vendors.find((v) => v.id === vendorId)!;
            job.vendorId = vendorId;
            job.status = "assigned";
            addLog(job, `Bright Lettings triaged: ${urgency}, estimated £${cost} — auto-approved, no landlord sign-off needed.`);
            addLog(job, `Assigned to ${vendor.name}.`);
          }
        });
      },

      assignVendor: (jobId, vendorId) => {
        mutate((draft) => {
          const job = draft.jobs.find((j) => j.id === jobId)!;
          const vendor = draft.vendors.find((v) => v.id === vendorId)!;
          job.vendorId = vendorId;
          job.status = "assigned";
          addLog(job, `Assigned to ${vendor.name}.`);
        });
      },

      landlordApprove: (jobId) => {
        mutate((draft) => {
          const job = draft.jobs.find((j) => j.id === jobId)!;
          const property = draft.properties.find((p) => p.id === job.propertyId)!;
          const landlord = draft.landlords.find((l) => l.id === property.landlordId);
          job.status = "approved";
          addLog(job, `${landlord?.name ?? "The landlord"} approved the estimated cost of £${job.costEstimate}.`);
        });
      },

      landlordDecline: (jobId, reason) => {
        mutate((draft) => {
          const job = draft.jobs.find((j) => j.id === jobId)!;
          const property = draft.properties.find((p) => p.id === job.propertyId)!;
          const landlord = draft.landlords.find((l) => l.id === property.landlordId);
          job.status = "declined";
          addLog(job, `${landlord?.name ?? "The landlord"} declined the job.${reason ? " Reason: " + reason : ""}`);
        });
      },

      vendorAccept: (jobId, date) => {
        mutate((draft) => {
          const job = draft.jobs.find((j) => j.id === jobId)!;
          const vendor = draft.vendors.find((v) => v.id === job.vendorId)!;
          job.status = "in_progress";
          addLog(job, `${vendor.name} accepted the job and scheduled a visit for ${date}.`);
        });
      },

      vendorComplete: (jobId, { notes, cost }) => {
        mutate((draft) => {
          const job = draft.jobs.find((j) => j.id === jobId)!;
          const vendor = draft.vendors.find((v) => v.id === job.vendorId)!;
          job.status = "completed";
          job.actualCost = cost;
          addLog(job, `Marked complete by ${vendor.name}: ${notes} (Actual cost £${cost})`);
        });
      },

      tenantConfirm: (jobId) => {
        mutate((draft) => {
          const job = draft.jobs.find((j) => j.id === jobId)!;
          const property = draft.properties.find((p) => p.id === job.propertyId)!;
          job.status = "closed";
          addLog(job, `${property.tenant} confirmed the issue is resolved.`);
        });
      },

      tenantReopen: (jobId) => {
        mutate((draft) => {
          const job = draft.jobs.find((j) => j.id === jobId)!;
          const property = draft.properties.find((p) => p.id === job.propertyId)!;
          job.status = "in_progress";
          addLog(job, `${property.tenant} reported the issue persists.`);
        });
      },

      addProperty: (input) => {
        mutate((draft) => {
          draft.properties.push({ id: uid("prop"), ...input });
        });
      },

      deleteProperty: (id) => {
        const jobCount = state.jobs.filter((j) => j.propertyId === id).length;
        if (jobCount > 0) {
          return { ok: false, reason: `This property has ${jobCount} job${jobCount === 1 ? "" : "s"} on record. Resolve or reassign them before deleting it.` };
        }
        mutate((draft) => {
          draft.properties = draft.properties.filter((p) => p.id !== id);
          draft.compliance = draft.compliance.filter((c) => c.propertyId !== id);
        });
        return { ok: true };
      },

      addVendor: (input) => {
        mutate((draft) => {
          draft.vendors.push({ id: uid("ven"), ...input });
        });
      },

      deleteVendor: (id) => {
        const jobCount = state.jobs.filter((j) => j.vendorId === id).length;
        if (jobCount > 0) {
          return { ok: false, reason: `This vendor has ${jobCount} job${jobCount === 1 ? "" : "s"} on record (active or past) and can't be deleted.` };
        }
        mutate((draft) => {
          draft.vendors = draft.vendors.filter((v) => v.id !== id);
        });
        return { ok: true };
      },

      addLandlord: (input) => {
        mutate((draft) => {
          draft.landlords.push({ id: uid("ll"), ...input });
        });
      },

      deleteLandlord: (id) => {
        const propertyCount = state.properties.filter((p) => p.landlordId === id).length;
        if (propertyCount > 0) {
          return { ok: false, reason: `This landlord still owns ${propertyCount} propert${propertyCount === 1 ? "y" : "ies"}. Reassign or delete those first.` };
        }
        mutate((draft) => {
          draft.landlords = draft.landlords.filter((l) => l.id !== id);
        });
        return { ok: true };
      },

      restoreSampleData: () => setState(seedState()),
    };
  }, [state]);

  return <StoreContext.Provider value={api}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

export function isOverdue(job: Job) {
  if (job.status === "completed" || job.status === "closed" || job.status === "declined") return false;
  const slaHours = SLA_HOURS[job.urgency] ?? 120;
  return (Date.now() - job.reportedAt) / 3600000 > slaHours;
}
