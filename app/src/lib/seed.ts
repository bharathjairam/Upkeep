import type { AppState } from "./types";

const hoursAgo = (h: number) => Date.now() - h * 3600 * 1000;
const daysAgo = (d: number) => Date.now() - d * 24 * 3600 * 1000;

export function seedState(): AppState {
  const landlords = [
    { id: "ll-priya", name: "Priya Shah", email: "priya.shah@example.com", phone: "07700 900001" },
    { id: "ll-marcus", name: "Marcus Webb", email: "marcus.webb@example.com", phone: "07700 900002" },
  ];

  const properties = [
    { id: "prop-1", address: "12 Elm Street, Flat 2B, Manchester", landlordId: "ll-priya", tenant: "Jordan Lee", tenancyStart: daysAgo(420) },
    { id: "prop-2", address: "45 Oak Avenue, Leeds", landlordId: "ll-priya", tenant: "Amara Okafor", tenancyStart: daysAgo(240) },
    { id: "prop-3", address: "8 Riverside Court, Bristol", landlordId: "ll-marcus", tenant: "Sofia Marin", tenancyStart: daysAgo(90) },
  ];

  const vendors = [
    { id: "ven-3", name: "FixIt Handyman Services", trade: "General", rating: 4.9, serviceArea: "Manchester, Leeds & Bristol", contact: "0113 555 0117" },
    { id: "ven-1", name: "Flow Plumbing Co.", trade: "Plumbing", rating: 4.8, serviceArea: "Manchester & Leeds", contact: "0161 555 0142" },
    { id: "ven-2", name: "Bright Spark Electrical", trade: "Electrical", rating: 4.6, serviceArea: "Greater Manchester", contact: "0161 555 0198" },
  ];

  const jobs: AppState["jobs"] = [
    {
      id: "JOB-1001", propertyId: "prop-1", category: "Plumbing", urgency: "urgent",
      description: "Kitchen tap is leaking constantly and pooling water under the sink.",
      status: "reported", costEstimate: null, actualCost: null, vendorId: null,
      photoDataUrl: null, reportedAt: hoursAgo(30),
      log: [{ ts: hoursAgo(30), text: "Jordan Lee reported the issue." }],
    },
    {
      id: "JOB-1002", propertyId: "prop-2", category: "Electrical", urgency: "emergency",
      description: "Bedroom socket sparked when I plugged in a lamp.",
      status: "awaiting_approval", costEstimate: 380, actualCost: null, vendorId: null,
      photoDataUrl: null, reportedAt: hoursAgo(5),
      log: [
        { ts: hoursAgo(5), text: "Amara Okafor reported the issue." },
        { ts: hoursAgo(4), text: "Bright Lettings triaged: Emergency, estimated £380 — over £250, sent to landlord for approval." },
      ],
    },
    {
      id: "JOB-1003", propertyId: "prop-1", category: "General", urgency: "routine",
      description: "Bathroom door handle is loose and won't latch.",
      status: "assigned", costEstimate: 90, actualCost: null, vendorId: "ven-3",
      photoDataUrl: null, reportedAt: hoursAgo(48),
      log: [
        { ts: hoursAgo(48), text: "Jordan Lee reported the issue." },
        { ts: hoursAgo(47), text: "Bright Lettings triaged: Routine, estimated £90 — auto-approved, no landlord sign-off needed." },
        { ts: hoursAgo(46), text: "Assigned to FixIt Handyman Services." },
      ],
    },
    {
      id: "JOB-1004", propertyId: "prop-2", category: "Plumbing", urgency: "urgent",
      description: "No hot water in the shower this morning.",
      status: "in_progress", costEstimate: 150, actualCost: null, vendorId: "ven-1",
      photoDataUrl: null, reportedAt: hoursAgo(26),
      log: [
        { ts: hoursAgo(26), text: "Amara Okafor reported the issue." },
        { ts: hoursAgo(25), text: "Bright Lettings triaged: Urgent, estimated £150 — auto-approved, no landlord sign-off needed." },
        { ts: hoursAgo(24), text: "Assigned to Flow Plumbing Co." },
        { ts: hoursAgo(20), text: "Flow Plumbing Co. accepted the job and scheduled a visit." },
      ],
    },
    {
      id: "JOB-1005", propertyId: "prop-1", category: "Electrical", urgency: "routine",
      description: "Hallway light flickers on and off.",
      status: "completed", costEstimate: 60, actualCost: 55, vendorId: "ven-2",
      photoDataUrl: null, reportedAt: hoursAgo(96),
      log: [
        { ts: hoursAgo(96), text: "Jordan Lee reported the issue." },
        { ts: hoursAgo(95), text: "Bright Lettings triaged: Routine, estimated £60 — auto-approved." },
        { ts: hoursAgo(94), text: "Assigned to Bright Spark Electrical." },
        { ts: hoursAgo(70), text: "Bright Spark Electrical accepted the job and scheduled a visit." },
        { ts: hoursAgo(48), text: "Marked complete by Bright Spark Electrical: Replaced faulty switch. (Actual cost £55)" },
      ],
    },
    {
      id: "JOB-1006", propertyId: "prop-2", category: "General", urgency: "routine",
      description: "Garden fence panel blew over in the wind.",
      status: "closed", costEstimate: 120, actualCost: 120, vendorId: "ven-3",
      photoDataUrl: null, reportedAt: hoursAgo(168),
      log: [
        { ts: hoursAgo(168), text: "Amara Okafor reported the issue." },
        { ts: hoursAgo(167), text: "Bright Lettings triaged: Routine, estimated £120 — auto-approved." },
        { ts: hoursAgo(166), text: "Assigned to FixIt Handyman Services." },
        { ts: hoursAgo(140), text: "FixIt Handyman Services accepted the job and scheduled a visit." },
        { ts: hoursAgo(120), text: "Marked complete by FixIt Handyman Services: Fence panel re-fixed and braced. (Actual cost £120)" },
        { ts: hoursAgo(115), text: "Amara Okafor confirmed the issue is resolved." },
      ],
    },
  ];

  const compliance = [
    { propertyId: "prop-1", item: "Gas Safety Certificate", daysLeft: 41 },
    { propertyId: "prop-1", item: "EICR (electrical)", daysLeft: -6 },
    { propertyId: "prop-1", item: "EPC", daysLeft: 640 },
    { propertyId: "prop-1", item: "Landlord Insurance", daysLeft: 128 },
    { propertyId: "prop-2", item: "Gas Safety Certificate", daysLeft: 12 },
    { propertyId: "prop-2", item: "EICR (electrical)", daysLeft: 210 },
    { propertyId: "prop-2", item: "EPC", daysLeft: 305 },
    { propertyId: "prop-2", item: "Landlord Insurance", daysLeft: 22 },
    { propertyId: "prop-3", item: "Gas Safety Certificate", daysLeft: 300 },
    { propertyId: "prop-3", item: "EICR (electrical)", daysLeft: 640 },
    { propertyId: "prop-3", item: "EPC", daysLeft: 500 },
    { propertyId: "prop-3", item: "Landlord Insurance", daysLeft: 350 },
  ];

  return { nextSeq: 1007, properties, vendors, landlords, jobs, compliance };
}
