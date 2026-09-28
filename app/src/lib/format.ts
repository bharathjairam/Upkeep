export function timeAgo(ts: number): string {
  const diffMs = Date.now() - ts;
  const hrs = diffMs / 3600000;
  if (hrs < 1) return Math.max(1, Math.round(diffMs / 60000)) + "m ago";
  if (hrs < 48) return Math.round(hrs) + "h ago";
  return Math.round(hrs / 24) + "d ago";
}

export function fmtDateTime(ts: number): string {
  return new Date(ts).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}
