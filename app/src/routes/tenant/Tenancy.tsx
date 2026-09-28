import { useStore } from "../../lib/store";
import { usePersona } from "../../lib/usePersona";
import { PageHeader } from "../../components/PageHeader";
import { PersonaSwitcher } from "../../components/PersonaSwitcher";
import { Building, User, CalendarDays, Phone } from "lucide-react";

function fmtDate(ts: number) {
  return new Date(ts).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export function TenantTenancy() {
  const { state, getLandlord } = useStore();
  const [propertyId, setPropertyId] = usePersona("tenant-property", state.properties[0].id);
  const property = state.properties.find((p) => p.id === propertyId)!;
  const landlord = getLandlord(property.landlordId);

  const rows = [
    { icon: Building, label: "Property", value: property.address },
    { icon: User, label: "Landlord", value: landlord?.name ?? "—" },
    { icon: CalendarDays, label: "Tenancy start", value: fmtDate(property.tenancyStart) },
    { icon: Phone, label: "Maintenance emergency line", value: "0800 060 0161 (24/7)" },
  ];

  return (
    <div>
      <PageHeader
        title="My Tenancy"
        description="Managed by Bright Lettings on behalf of your landlord."
        right={
          <PersonaSwitcher
            label="Viewing as"
            value={propertyId}
            onChange={setPropertyId}
            options={state.properties.map((p) => ({ id: p.id, label: `${p.tenant} — ${p.address}` }))}
          />
        }
      />

      <div className="max-w-xl overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
        {rows.map((row, i) => (
          <div key={i} className={`flex items-center gap-3 px-5 py-4 ${i > 0 ? "border-t border-border" : ""}`}>
            <row.icon className="h-4 w-4 shrink-0 text-accent-dark" />
            <div>
              <div className="text-xs text-body">{row.label}</div>
              <div className="text-sm font-semibold text-ink">{row.value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
