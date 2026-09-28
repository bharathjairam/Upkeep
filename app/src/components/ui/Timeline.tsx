import type { LogEntry } from "../../lib/types";
import { fmtDateTime } from "../../lib/format";

export function Timeline({ log }: { log: LogEntry[] }) {
  return (
    <ul className="mt-3 space-y-1.5 border-t border-dashed border-border pt-3">
      {log.map((entry, i) => (
        <li key={i} className="relative pl-4 text-[13px] text-body">
          <span className="absolute left-0 top-[7px] h-1.5 w-1.5 rounded-full bg-accent" />
          <span className="mr-1.5 font-semibold text-body">{fmtDateTime(entry.ts)}</span>
          {entry.text}
        </li>
      ))}
    </ul>
  );
}
