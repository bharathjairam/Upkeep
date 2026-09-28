import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

const fieldClass =
  "w-full rounded-lg border border-border bg-surface-subtle px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 dark:text-ink";

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm font-semibold text-body">
      {label}
      {children}
    </label>
  );
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${fieldClass} ${props.className ?? ""}`} />;
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${fieldClass} ${props.className ?? ""}`} />;
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${fieldClass} resize-y ${props.className ?? ""}`} />;
}
