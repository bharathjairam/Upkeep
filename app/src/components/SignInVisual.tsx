import type { ReactNode } from "react";

function FloatingCard({
  className,
  rotateClass,
  delayMs,
  children,
}: {
  className?: string;
  rotateClass: string;
  delayMs: number;
  children: ReactNode;
}) {
  return (
    <div
      className={`animate-fade-up absolute rounded-2xl border border-border bg-surface p-4 shadow-md transition-transform duration-300 ease-out hover:z-20 hover:rotate-0 hover:scale-105 ${rotateClass} ${className ?? ""}`}
      style={{ animationDelay: `${delayMs}ms` }}
    >
      {children}
    </div>
  );
}

export function SignInVisual() {
  return (
    <div className="relative hidden h-full min-h-[520px] w-full overflow-hidden lg:block">
      <div className="absolute inset-0 rounded-[32px] bg-accent-tint" />
      <div
        className="absolute inset-0 rounded-[32px] opacity-60"
        style={{ background: "radial-gradient(circle at 30% 20%, var(--color-accent-light), transparent 60%)" }}
      />

      <FloatingCard rotateClass="-rotate-6" delayMs={0} className="left-[8%] top-[12%] w-56">
        <div className="text-3xl font-bold text-ink">5</div>
        <div className="mt-1 text-sm text-body">Open jobs</div>
      </FloatingCard>

      <FloatingCard rotateClass="rotate-3" delayMs={100} className="left-[18%] top-[42%] w-72">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-soft text-xs font-bold text-accent-dark">DS</span>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-ink">Leaking tap — Flat 4B</div>
            <div className="mt-0.5 font-mono text-[11px] text-muted">JOB-1017 · Dana S.</div>
          </div>
        </div>
        <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-accent-light px-2.5 py-1 text-[11px] font-bold text-accent-contrast">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-dark" /> In progress
        </span>
      </FloatingCard>

      <FloatingCard rotateClass="-rotate-3" delayMs={200} className="left-[36%] top-[68%] w-64">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-soft text-xs font-bold text-accent-dark">RK</span>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-ink">Boiler making noise</div>
            <div className="mt-0.5 font-mono text-[11px] text-muted">JOB-1015 · Ravi K.</div>
          </div>
        </div>
        <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-2.5 py-1 text-[11px] font-bold text-accent-dark">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" /> New
        </span>
      </FloatingCard>

      <FloatingCard rotateClass="rotate-6" delayMs={300} className="left-[58%] top-[8%] w-48">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-success-soft px-2.5 py-1 text-[11px] font-bold text-success-ink">
          <span className="h-1.5 w-1.5 rounded-full bg-success" /> Closed
        </span>
        <div className="mt-2 text-sm font-semibold text-ink">Gas safety check</div>
        <div className="mt-0.5 font-mono text-[11px] text-muted">£120 · confirmed</div>
      </FloatingCard>
    </div>
  );
}
