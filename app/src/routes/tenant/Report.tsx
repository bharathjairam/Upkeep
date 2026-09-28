import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../lib/store";
import type { Urgency } from "../../lib/types";
import { usePersona } from "../../lib/usePersona";
import { resizeImageToDataUrl } from "../../lib/image";
import { PageHeader } from "../../components/PageHeader";
import { PersonaSwitcher } from "../../components/PersonaSwitcher";
import { Field, Select, Textarea, Input } from "../../components/ui/Field";
import { Button } from "../../components/ui/Button";

const CATEGORIES = ["Plumbing", "Electrical", "Heating", "Appliance", "General", "Structural"];

export function TenantReport() {
  const { state, reportIssue } = useStore();
  const navigate = useNavigate();
  const [propertyId, setPropertyId] = usePersona("tenant-property", state.properties[0].id);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [urgency, setUrgency] = useState<Urgency>("routine");
  const [description, setDescription] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const photoDataUrl = photoFile ? await resizeImageToDataUrl(photoFile, 160) : null;
    reportIssue({ propertyId, category, urgency, description, photoDataUrl });
    setSubmitting(false);
    setDescription("");
    setPhotoFile(null);
    navigate("/tenant/issues");
  }

  return (
    <div>
      <PageHeader
        title="Report an Issue"
        description="Tell us what's wrong — your property manager will triage it right away."
        right={
          <PersonaSwitcher
            label="Reporting as"
            value={propertyId}
            onChange={setPropertyId}
            options={state.properties.map((p) => ({ id: p.id, label: `${p.tenant} — ${p.address}` }))}
          />
        }
      />

      <form onSubmit={handleSubmit} className="flex max-w-xl flex-col gap-4 rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Category">
            <Select value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </Select>
          </Field>
          <Field label="Urgency">
            <Select value={urgency} onChange={(e) => setUrgency(e.target.value as Urgency)}>
              <option value="routine">Routine — can wait a few days</option>
              <option value="urgent">Urgent — needs attention today/tomorrow</option>
              <option value="emergency">Emergency — needs attention now</option>
            </Select>
          </Field>
        </div>
        <Field label="Describe the issue">
          <Textarea rows={4} required placeholder="What's wrong, and where?" value={description} onChange={(e) => setDescription(e.target.value)} />
        </Field>
        <Field label="Photo (optional)">
          <Input type="file" accept="image/*" onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)} />
        </Field>
        <Button type="submit" disabled={!description || submitting} className="mt-2 w-full">
          {submitting ? "Submitting…" : "Report issue"}
        </Button>
      </form>
    </div>
  );
}
