import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import type { ReactNode } from "react";
import type { RoleConfig } from "../lib/roles";
import { Circle, LogOut, Menu, X } from "lucide-react";

export function RoleShell({ role, header }: { role: RoleConfig; header?: ReactNode }) {
  const Icon = role.icon;
  const [navOpen, setNavOpen] = useState(false);
  const closeNav = () => setNavOpen(false);

  return (
    <div className="h-screen overflow-hidden bg-surface-subtle lg:flex">
      {/* Mobile / tablet top bar */}
      <div className="flex h-14 items-center justify-between border-b border-border bg-surface px-4 lg:hidden">
        <button onClick={() => setNavOpen(true)} aria-label="Open menu" className="text-body hover:text-ink">
          <Menu className="h-5 w-5" />
        </button>
        <Link to="/" className="flex items-center gap-2">
          <Circle className="h-2.5 w-2.5 fill-accent text-accent" />
          <span className="text-[15px] font-bold tracking-tight text-ink">Upkeep</span>
        </Link>
        <div className={`flex h-8 w-8 items-center justify-center rounded-full ${role.classes.chip}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>

      {/* Backdrop for mobile drawer */}
      {navOpen && <div className="fixed inset-0 z-40 bg-ink/30 lg:hidden" onClick={closeNav} />}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col overflow-y-auto border-r border-border bg-surface transition-transform duration-200 ease-out lg:static lg:z-auto lg:w-64 lg:shrink-0 lg:translate-x-0 ${
          navOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-5 lg:block">
          <Link to="/" className="flex items-center gap-2" onClick={closeNav}>
            <Circle className="h-2.5 w-2.5 fill-accent text-accent" />
            <span className="text-[15px] font-bold tracking-tight text-ink">Upkeep</span>
          </Link>
          <button onClick={closeNav} aria-label="Close menu" className="text-muted hover:text-ink lg:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className={`mx-4 mb-4 flex items-center gap-2.5 rounded-full px-3.5 py-2.5 ${role.classes.chip}`}>
          <Icon className="h-5 w-5" />
          <div className="text-sm font-bold">{role.label}</div>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3">
          {role.navItems.map((item, i) => {
            const prevSection = i > 0 ? role.navItems[i - 1].section : undefined;
            const showSectionLabel = item.section && item.section !== prevSection;
            return (
              <div key={item.to}>
                {showSectionLabel && (
                  <div className="mb-1 mt-4 px-3 text-[11px] font-bold uppercase tracking-wide text-muted first:mt-1">{item.section}</div>
                )}
                <NavLink
                  to={item.to}
                  onClick={closeNav}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 rounded-full px-3.5 py-2 text-sm font-semibold transition-colors ${
                      isActive ? role.classes.chip : "text-body hover:bg-accent-soft hover:text-accent-dark"
                    }`
                  }
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              </div>
            );
          })}
        </nav>

        <div className="border-t border-border p-3">
          <Link
            to="/"
            onClick={closeNav}
            className="flex w-full items-center gap-2.5 rounded-full px-3.5 py-2 text-sm font-semibold text-body hover:bg-accent-soft hover:text-accent-dark"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </Link>
        </div>
      </aside>

      <main className="h-[calc(100vh-56px)] flex-1 overflow-y-auto lg:h-screen">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          {header}
          <Outlet />
        </div>
      </main>
    </div>
  );
}
