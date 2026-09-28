import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "bg-accent text-accent-contrast shadow-[0_4px_14px_color-mix(in_srgb,var(--color-accent)_35%,transparent)] hover:bg-accent-hover hover:text-white",
  secondary: "border border-border bg-surface text-ink hover:border-accent",
  ghost: "text-body hover:text-ink",
};

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${VARIANT_CLASSES[variant]} ${className}`}
      {...props}
    />
  );
}
