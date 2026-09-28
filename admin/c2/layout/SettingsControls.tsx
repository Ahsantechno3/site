"use client";

import type { InputHTMLAttributes, ReactNode } from "react";
import { LoaderCircle, Save } from "lucide-react";
import Button from "@/c2/ui/Button";
import Select from "@/c2/ui/Select";

export function SettingsCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-5 lg:p-6">
      <header className="mb-6">
        <h2 className="text-base font-semibold text-[var(--text)]">{title}</h2>
        <p className="mt-1 text-xs text-[var(--text-muted)]">{description}</p>
      </header>
      {children}
    </section>
  );
}

export function SettingsInput({
  label,
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-xs font-medium text-[var(--text-soft)]">{label}</span>
      <input
        {...props}
        className="h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--text)] outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-light)]"
      />
    </label>
  );
}

export function SettingsSelect({
  label,
  value,
  options,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <span className="mb-2 block text-xs font-medium text-[var(--text-soft)]">{label}</span>
      <Select
        value={value}
        options={options.map((option) => ({ label: option, value: option }))}
        onChange={onChange}
        placeholder={placeholder}
        variant="outline"
        fullWidth
      />
    </div>
  );
}

export function SettingsToggle({
  label,
  enabled,
  onChange,
}: {
  label: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-label={label}
      onClick={() => onChange(!enabled)}
      className={`relative h-5 w-9 shrink-0 rounded-full transition ${
        enabled ? "bg-[var(--primary)]" : "bg-[var(--border)]"
      }`}
    >
      <span
        className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition ${
          enabled ? "left-4" : "left-0.5"
        }`}
      />
    </button>
  );
}

export function SettingsSectionTitle({ title }: { title: string }) {
  return <h3 className="text-sm font-semibold text-[var(--text)]">{title}</h3>;
}

export function SettingsSaveButton({
  onSave,
  saving = false,
}: {
  onSave: () => void;
  saving?: boolean;
}) {
  return (
    <div className="mt-6 flex justify-end border-t border-[var(--border)] pt-5">
      <Button onClick={onSave} disabled={saving} icon={saving ? LoaderCircle : Save}>
        {saving ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
}