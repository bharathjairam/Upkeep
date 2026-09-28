import { useStore } from "../../lib/store";
import { usePersona } from "../../lib/usePersona";
import { PageHeader } from "../../components/PageHeader";
import { PersonaSwitcher } from "../../components/PersonaSwitcher";
import { StatTile } from "../../components/ui/StatTile";
import { Stars } from "../../components/ui/Stars";
import { MapPin, Phone, Wrench } from "lucide-react";

export function VendorProfile() {
  const { state } = useStore();
  const [vendorId, setVendorId] = usePersona("vendor", state.vendors[0].id);
  const vendor = state.vendors.find((v) => v.id === vendorId)!;

  const vendorJobs = state.jobs.filter((j) => j.vendorId === vendorId);
  const completed = vendorJobs.filter((j) => ["completed", "closed"].includes(j.status)).length;
  const propertiesCovered = new Set(vendorJobs.map((j) => j.propertyId)).size;

  return (
    <div>
      <PageHeader
        title="Profile"
        description="How your business appears to property managers."
        right={
          <PersonaSwitcher
            label="Signed in as"
            value={vendorId}
            onChange={setVendorId}
            options={state.vendors.map((v) => ({ id: v.id, label: `${v.name} (${v.trade})` }))}
          />
        }
      />

      <div className="max-w-xl rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-ink">{vendor.name}</h2>
          <Stars rating={vendor.rating} />
        </div>
        <div className="mt-4 flex flex-col gap-3 text-sm">
          <div className="flex items-center gap-2 text-body">
            <Wrench className="h-4 w-4 text-accent-dark" /> {vendor.trade}
          </div>
          <div className="flex items-center gap-2 text-body">
            <MapPin className="h-4 w-4 text-accent-dark" /> {vendor.serviceArea}
          </div>
          <div className="flex items-center gap-2 text-body">
            <Phone className="h-4 w-4 text-accent-dark" /> {vendor.contact}
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:max-w-xl">
        <StatTile value={completed} label="Jobs completed" />
        <StatTile value={propertiesCovered} label="Properties covered" />
        <StatTile value={vendor.rating.toFixed(1)} label="Average rating" />
      </div>
    </div>
  );
}
