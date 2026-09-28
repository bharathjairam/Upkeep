import { useStore } from "./store";
import { usePersona } from "./usePersona";

/** Scopes the signed-in landlord to only their own properties/jobs — there can be more than one landlord. */
export function useLandlordScope() {
  const { state } = useStore();
  const [landlordId, setLandlordId] = usePersona("landlord", state.landlords[0]?.id ?? "");
  const landlord = state.landlords.find((l) => l.id === landlordId);

  const properties = state.properties.filter((p) => p.landlordId === landlordId);
  const propertyIds = properties.map((p) => p.id);
  const jobs = state.jobs.filter((j) => propertyIds.includes(j.propertyId));

  return { landlordId, setLandlordId, landlord, landlords: state.landlords, properties, propertyIds, jobs };
}
