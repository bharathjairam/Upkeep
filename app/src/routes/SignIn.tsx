import { useState, type FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ROLES, roleByKey, type RoleKey } from "../lib/roles";
import { Button } from "../components/ui/Button";
import { Field, Input } from "../components/ui/Field";
import { SignInVisual } from "../components/SignInVisual";
import { Circle, ArrowLeft } from "lucide-react";

const DEMO_ACCOUNTS: Record<RoleKey, { email: string }> = {
  manager: { email: "ops@brightlettings.co.uk" },
  tenant: { email: "jordan.lee@example.com" },
  landlord: { email: "priya.shah@example.com" },
  vendor: { email: "jobs@fixithandyman.co.uk" },
};

export function SignIn() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestedRole = roleByKey(searchParams.get("role") ?? undefined)?.key;
  const [role, setRole] = useState<RoleKey>(requestedRole ?? "manager");
  const [email, setEmail] = useState(DEMO_ACCOUNTS[requestedRole ?? "manager"].email);
  const [password, setPassword] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const target = ROLES.find((r) => r.key === role)!;
    navigate(target.navItems[0].to);
  }

  return (
    <div className="min-h-screen bg-surface-subtle">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <Circle className="h-3 w-3 fill-accent text-accent" />
            <span className="text-lg font-bold tracking-tight text-ink">Upkeep</span>
          </div>
          <a href="/" className="flex items-center gap-1.5 text-sm font-semibold text-body hover:text-accent-dark">
            <ArrowLeft className="h-4 w-4" /> Back to site
          </a>
        </div>
      </header>

      <div className="flex items-center justify-center px-6 py-16">
        <div className="grid w-full max-w-5xl grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div className="animate-fade-up rounded-2xl border border-border bg-surface p-8 shadow-sm">
            <h1 className="text-xl font-bold text-ink">Sign in</h1>
            <p className="mt-1 text-sm text-body">
              {requestedRole ? `You picked ${ROLES.find((r) => r.key === requestedRole)!.label} — continue below.` : "Welcome back — pick your workspace and sign in."}
            </p>

            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
              <Field label="I'm signing in as">
                <div className="grid grid-cols-2 gap-2">
                  {ROLES.map((r) => (
                    <button
                      key={r.key}
                      type="button"
                      onClick={() => {
                        setRole(r.key);
                        setEmail(DEMO_ACCOUNTS[r.key].email);
                      }}
                      className={`flex items-center gap-2 rounded-full border px-3.5 py-2 text-left text-xs font-semibold transition-colors ${
                        role === r.key ? `border-transparent ${r.classes.chip}` : "border-border text-body hover:border-accent"
                      }`}
                    >
                      <r.icon className="h-4 w-4 shrink-0" />
                      {r.label}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="Email">
                <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </Field>
              <Field label="Password">
                <Input type="password" required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
              </Field>
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-1.5 text-body">
                  <input type="checkbox" defaultChecked className="rounded" /> Remember me
                </label>
                <button type="button" className="font-semibold text-accent hover:underline">
                  Forgot password?
                </button>
              </div>
              <Button type="submit" className="w-full">
                Sign in
              </Button>
              <p className="text-center text-xs text-muted">This is a working prototype — any email &amp; password will sign you in.</p>
            </form>
          </div>

          <SignInVisual />
        </div>
      </div>
    </div>
  );
}
