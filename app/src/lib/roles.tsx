import {
  Building2,
  User,
  Home,
  Wrench,
  LayoutDashboard,
  ClipboardList,
  CheckCircle2,
  Hammer,
  History,
  FileText,
  ListChecks,
  Building,
  ListTodo,
  Users,
  BarChart3,
  Bell,
  KeyRound,
  FolderOpen,
  Wallet,
  Banknote,
  UserCircle,
} from "lucide-react";
import type { ComponentType } from "react";

export type RoleKey = "manager" | "tenant" | "landlord" | "vendor";

export interface NavItem {
  to: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  section?: string;
}

export interface RoleConfig {
  key: RoleKey;
  path: string;
  label: string;
  tagline: string;
  icon: ComponentType<{ className?: string }>;
  /** Fully literal Tailwind class strings — never build these with template interpolation,
   *  the CSS-scanning build step only picks up class names it can see written out in full. */
  classes: { text: string; chip: string };
  navItems: NavItem[];
}

export const ROLES: RoleConfig[] = [
  {
    key: "manager",
    path: "/manager",
    label: "Property Manager",
    tagline: "Triage requests, route approvals, keep every job moving.",
    icon: Building2,
    classes: { text: "text-accent", chip: "bg-accent-soft text-accent-dark" },
    navItems: [
      { to: "/manager/overview", label: "Overview", icon: LayoutDashboard, section: "Workflow" },
      { to: "/manager/triage", label: "Triage Queue", icon: ClipboardList, section: "Workflow" },
      { to: "/manager/approvals", label: "Approvals", icon: CheckCircle2, section: "Workflow" },
      { to: "/manager/active", label: "Active Jobs", icon: Hammer, section: "Workflow" },
      { to: "/manager/history", label: "History", icon: History, section: "Workflow" },
      { to: "/manager/properties", label: "Properties", icon: Building, section: "Directory" },
      { to: "/manager/vendors", label: "Vendors", icon: Wrench, section: "Directory" },
      { to: "/manager/landlords", label: "Landlords", icon: Users, section: "Directory" },
      { to: "/manager/reports", label: "Reports", icon: BarChart3, section: "Insights" },
    ],
  },
  {
    key: "tenant",
    path: "/tenant",
    label: "Tenant",
    tagline: "Report issues and track them through to done.",
    icon: User,
    classes: { text: "text-accent", chip: "bg-accent-soft text-accent-dark" },
    navItems: [
      { to: "/tenant/home", label: "Home", icon: LayoutDashboard },
      { to: "/tenant/report", label: "Report an Issue", icon: FileText },
      { to: "/tenant/issues", label: "My Issues", icon: ListChecks },
      { to: "/tenant/notifications", label: "Notifications", icon: Bell },
      { to: "/tenant/tenancy", label: "My Tenancy", icon: KeyRound },
    ],
  },
  {
    key: "landlord",
    path: "/landlord",
    label: "Landlord",
    tagline: "Approve spend, track compliance, see the portfolio.",
    icon: Home,
    classes: { text: "text-accent", chip: "bg-accent-soft text-accent-dark" },
    navItems: [
      { to: "/landlord/overview", label: "Overview", icon: LayoutDashboard },
      { to: "/landlord/approvals", label: "Approvals", icon: CheckCircle2 },
      { to: "/landlord/portfolio", label: "Portfolio", icon: Building },
      { to: "/landlord/documents", label: "Documents", icon: FolderOpen },
      { to: "/landlord/financials", label: "Financials", icon: Wallet },
    ],
  },
  {
    key: "vendor",
    path: "/vendor",
    label: "Vendor",
    tagline: "See what's assigned, schedule it, get it done.",
    icon: Wrench,
    classes: { text: "text-accent", chip: "bg-accent-soft text-accent-dark" },
    navItems: [
      { to: "/vendor/overview", label: "Overview", icon: LayoutDashboard },
      { to: "/vendor/queue", label: "Job Queue", icon: ListTodo },
      { to: "/vendor/history", label: "History", icon: History },
      { to: "/vendor/earnings", label: "Earnings", icon: Banknote },
      { to: "/vendor/profile", label: "Profile", icon: UserCircle },
    ],
  },
];

export function roleByKey(key: string | undefined) {
  return ROLES.find((r) => r.key === key);
}
