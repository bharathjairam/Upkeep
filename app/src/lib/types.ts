export type Urgency = "emergency" | "urgent" | "routine";

export type JobStatus =
  | "reported"
  | "awaiting_approval"
  | "approved"
  | "assigned"
  | "in_progress"
  | "completed"
  | "closed"
  | "declined";

export interface Landlord {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface Property {
  id: string;
  address: string;
  landlordId: string;
  tenant: string;
  tenancyStart: number;
}

export interface Vendor {
  id: string;
  name: string;
  trade: string;
  rating: number;
  serviceArea: string;
  contact: string;
}

export interface LogEntry {
  ts: number;
  text: string;
}

export interface Job {
  id: string;
  propertyId: string;
  category: string;
  urgency: Urgency;
  description: string;
  status: JobStatus;
  costEstimate: number | null;
  actualCost: number | null;
  vendorId: string | null;
  photoDataUrl: string | null;
  reportedAt: number;
  log: LogEntry[];
}

export interface ComplianceItem {
  propertyId: string;
  item: string;
  daysLeft: number;
}

export interface AppState {
  nextSeq: number;
  properties: Property[];
  vendors: Vendor[];
  landlords: Landlord[];
  jobs: Job[];
  compliance: ComplianceItem[];
}
