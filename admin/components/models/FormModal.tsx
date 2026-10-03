"use client";

import React, { useState, useMemo } from "react";
import {
  X,
  Tag as TagIcon,
  PlusCircle,
  UploadCloud,
  Trash2,
} from "lucide-react";
import Select, { SelectOption } from "@/components/ui/Select";
import Button from "@/components/ui/Button";

// Export SelectOption for module integration
export type { SelectOption };

export type FormFieldType =
  | "text"
  | "number"
  | "textarea"
  | "select"
  | "checkbox"
  | "switch"
  | "date"
  | "tags"
  | "key-value"
  | "image";

export interface FormField {
  name: string; // Key in formData (e.g. "title", "sku", "address.city")
  label: string;
  type: FormFieldType;
  placeholder?: string;
  required?: boolean;
  options?: SelectOption[];
  defaultValue?: any;
  colSpan?: 1 | 2 | 3 | 4; // Grid column span in a 4-column layout (1 = 25%, 2 = 50%, 3 = 75%, 4 = 100%)
  section?: string; // Grouping section title (e.g. "Basic Details", "Pricing & Inventory")
  disabled?: boolean;
  min?: number;
  max?: number;
  step?: number;
  rows?: number;
  helperText?: string;
}

export interface ItemFormData {
  [key: string]: any;
}

export interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  formMode: "add" | "edit";
  itemTypeLabel?: string;
  formData: ItemFormData;
  setFormData: React.Dispatch<React.SetStateAction<ItemFormData>>;
  handleSave: (e: React.FormEvent) => void;
  fields?: FormField[]; // Dynamic fields defined in page config
  categoryOptions?: SelectOption[];
  brandOptions?: SelectOption[];
  statusOptions?: SelectOption[];
  error?: string | null;
}

// Utility to read nested object keys (e.g. "personalInfo.firstName")
function getNestedValue(obj: any, path: string): any {
  if (!obj) return "";
  if (obj[path] !== undefined) return obj[path];
  const parts = path.split(".");
  let current = obj;
  for (const part of parts) {
    if (current === undefined || current === null) return "";
    current = current[part];
  }
  return current !== undefined && current !== null ? current : "";
}

// Utility to write nested object keys
function setNestedValue(obj: any, path: string, value: any): any {
  if (!path.includes(".")) {
    return { ...obj, [path]: value };
  }
  const parts = path.split(".");
  const newObj = { ...obj };
  let current = newObj;
  for (let i = 0; i < parts.length - 1; i++) {
    current[parts[i]] = { ...(current[parts[i]] || {}) };
    current = current[parts[i]];
  }
  current[parts[parts.length - 1]] = value;
  return newObj;
}

export const FormModal: React.FC<FormModalProps> = ({
  isOpen,
  onClose,
  formMode,
  itemTypeLabel = "Item",
  formData,
  setFormData,
  handleSave,
  fields = [],
  categoryOptions = [],
  brandOptions = [],
  statusOptions = [],
  error,
}) => {
  const [tagInputs, setTagInputs] = useState<Record<string, string>>({});

  // Group fields by section
  const groupedSections = useMemo(() => {
    if (!fields || fields.length === 0) return [];
    const sectionsMap = new Map<string, FormField[]>();

    fields.forEach((field) => {
      const sectionName = field.section || "General Information";
      if (!sectionsMap.has(sectionName)) {
        sectionsMap.set(sectionName, []);
      }
      sectionsMap.get(sectionName)!.push(field);
    });

    return Array.from(sectionsMap.entries()).map(([title, sectionFields]) => ({
      title,
      fields: sectionFields,
    }));
  }, [fields]);

  if (!isOpen) return null;

  // Change handler for standard input fields
  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData((prev) => setNestedValue(prev, fieldName, value));
  };

  // Tag helper functions
  const handleAddTag = (fieldName: string) => {
    const inputVal = (tagInputs[fieldName] || "").trim();
    if (!inputVal) return;

    const currentTags: string[] = getNestedValue(formData, fieldName) || [];
    if (!currentTags.includes(inputVal)) {
      handleFieldChange(fieldName, [...currentTags, inputVal]);
      setTagInputs((prev) => ({ ...prev, [fieldName]: "" }));
    }
  };

  const handleRemoveTag = (fieldName: string, tagToRemove: string) => {
    const currentTags: string[] = getNestedValue(formData, fieldName) || [];
    handleFieldChange(
      fieldName,
      currentTags.filter((t) => t !== tagToRemove)
    );
  };

  // Key-Value specifications helper functions
  const handleAddKeyValueRow = (fieldName: string) => {
    const currentRows = getNestedValue(formData, fieldName) || [];
    handleFieldChange(fieldName, [...currentRows, { key: "", value: "" }]);
  };

  const handleKeyValueChange = (
    fieldName: string,
    index: number,
    keyOrVal: "key" | "value",
    val: string
  ) => {
    const currentRows = [...(getNestedValue(formData, fieldName) || [])];
    currentRows[index] = { ...currentRows[index], [keyOrVal]: val };
    handleFieldChange(fieldName, currentRows);
  };

  const handleRemoveKeyValueRow = (fieldName: string, index: number) => {
    const currentRows = getNestedValue(formData, fieldName) || [];
    handleFieldChange(
      fieldName,
      currentRows.filter((_: any, idx: number) => idx !== index)
    );
  };

  // Grid column span classes
  const getColSpanClass = (span?: number) => {
    switch (span) {
      case 1:
        return "col-span-1 sm:col-span-1 md:col-span-1";
      case 2:
        return "col-span-1 sm:col-span-2 md:col-span-2";
      case 3:
        return "col-span-1 sm:col-span-2 md:col-span-3";
      case 4:
      default:
        return "col-span-1 sm:col-span-2 md:col-span-4";
    }
  };

  // Render individual field
  const renderField = (field: FormField) => {
    const rawValue = getNestedValue(formData, field.name);
    const colClass = getColSpanClass(field.colSpan);

    switch (field.type) {
      case "text":
        return (
          <div key={field.name} className={colClass}>
            <label className="font-bold text-[var(--text)] block mb-1 text-xs">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type="text"
              required={field.required}
              disabled={field.disabled}
              value={rawValue}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              placeholder={field.placeholder || `Enter ${field.label}`}
              className="w-full px-3 py-2 bg-[var(--surface-muted)] border border-[var(--border)] rounded-xl outline-none text-xs text-[var(--text)] focus:border-[var(--primary)] transition-colors"
            />
            {field.helperText && (
              <span className="text-[10px] text-[var(--text-muted)] mt-0.5 block">
                {field.helperText}
              </span>
            )}
          </div>
        );

      case "number":
        return (
          <div key={field.name} className={colClass}>
            <label className="font-bold text-[var(--text)] block mb-1 text-xs">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type="number"
              required={field.required}
              disabled={field.disabled}
              min={field.min}
              max={field.max}
              step={field.step || 1}
              value={rawValue === "" || rawValue === undefined ? "" : rawValue}
              onChange={(e) =>
                handleFieldChange(
                  field.name,
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
              placeholder={field.placeholder || "0"}
              className="w-full px-3 py-2 bg-[var(--surface-muted)] border border-[var(--border)] rounded-xl outline-none text-xs text-[var(--text)] focus:border-[var(--primary)] transition-colors"
            />
            {field.helperText && (
              <span className="text-[10px] text-[var(--text-muted)] mt-0.5 block">
                {field.helperText}
              </span>
            )}
          </div>
        );

      case "date":
        return (
          <div key={field.name} className={colClass}>
            <label className="font-bold text-[var(--text)] block mb-1 text-xs">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type="date"
              required={field.required}
              disabled={field.disabled}
              value={
                rawValue
                  ? typeof rawValue === "string"
                    ? rawValue.split("T")[0]
                    : new Date(rawValue).toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              className="w-full px-3 py-2 bg-[var(--surface-muted)] border border-[var(--border)] rounded-xl outline-none text-xs text-[var(--text)] focus:border-[var(--primary)] transition-colors"
            />
            {field.helperText && (
              <span className="text-[10px] text-[var(--text-muted)] mt-0.5 block">
                {field.helperText}
              </span>
            )}
          </div>
        );

      case "select":
        return (
          <div key={field.name} className={colClass}>
            <label className="font-bold text-[var(--text)] block mb-1 text-xs">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <Select
              value={String(rawValue || "")}
              options={field.options || []}
              onChange={(val) => handleFieldChange(field.name, val)}
              placeholder={field.placeholder || `Select ${field.label}`}
              fullWidth
              variant="outline"
              size="md"
              disabled={field.disabled}
            />
            {field.helperText && (
              <span className="text-[10px] text-[var(--text-muted)] mt-0.5 block">
                {field.helperText}
              </span>
            )}
          </div>
        );

      case "switch":
      case "checkbox":
        return (
          <div key={field.name} className={`${colClass} flex items-center gap-3 pt-4 sm:pt-6`}>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={Boolean(rawValue)}
                disabled={field.disabled}
                onChange={(e) => handleFieldChange(field.name, e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-[var(--border)] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-[var(--surface)] after:border-[var(--border)] after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--primary)]" />
            </label>
            <span className="font-bold text-[var(--text)] text-xs cursor-pointer select-none">
              {field.label}
            </span>
          </div>
        );

      case "textarea":
        return (
          <div key={field.name} className={colClass}>
            <label className="font-bold text-[var(--text)] block mb-1 text-xs">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <textarea
              rows={field.rows || 3}
              required={field.required}
              disabled={field.disabled}
              value={rawValue}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}...`}
              className="w-full px-3 py-2 bg-[var(--surface-muted)] border border-[var(--border)] rounded-xl outline-none text-xs text-[var(--text)] focus:border-[var(--primary)] resize-none transition-colors [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-[var(--primary)] [&::-webkit-scrollbar-thumb]:rounded-full"
            />
            {field.helperText && (
              <span className="text-[10px] text-[var(--text-muted)] mt-0.5 block">
                {field.helperText}
              </span>
            )}
          </div>
        );

      case "tags":
        const tagsList: string[] = Array.isArray(rawValue) ? rawValue : [];
        const currentTagInput = tagInputs[field.name] || "";
        return (
          <div key={field.name} className={colClass}>
            <label className="font-bold text-[var(--text)] block mb-1 text-xs">
              {field.label}
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={currentTagInput}
                onChange={(e) =>
                  setTagInputs((prev) => ({ ...prev, [field.name]: e.target.value }))
                }
                placeholder={field.placeholder || "Type and press Enter to add tag"}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag(field.name);
                  }
                }}
                className="flex-1 min-w-0 px-3 py-1.5 bg-[var(--surface-muted)] border border-[var(--border)] rounded-xl outline-none text-xs text-[var(--text)] focus:border-[var(--primary)]"
              />
              <Button
                variant="secondary"
                size="sm"
                type="button"
                onClick={() => handleAddTag(field.name)}
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-1.5 min-h-6">
              {tagsList.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 bg-[var(--primary-light,#fff7ed)] border border-[var(--primary-border,#fed7aa)] text-[var(--primary)] rounded-lg text-[10px] font-bold flex items-center gap-1"
                >
                  <TagIcon className="w-2.5 h-2.5" />
                  {tag}
                  <X
                    className="w-3 h-3 cursor-pointer hover:text-red-500"
                    onClick={() => handleRemoveTag(field.name, tag)}
                  />
                </span>
              ))}
            </div>
          </div>
        );

      case "key-value":
        const rows: Array<{ key: string; value: string }> = Array.isArray(rawValue)
          ? rawValue
          : [];
        return (
          <div key={field.name} className={colClass}>
            <div className="flex items-center justify-between mb-1 gap-2">
              <label className="font-bold text-[var(--text)] text-xs">
                {field.label}
              </label>
              <Button
                variant="ghost"
                size="sm"
                type="button"
                icon={PlusCircle}
                onClick={() => handleAddKeyValueRow(field.name)}
              >
                Add Row
              </Button>
            </div>
            <div className="space-y-2 max-h-36 overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-[var(--primary)] [&::-webkit-scrollbar-thumb]:rounded-full">
              {rows.map((row, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Key / Attribute"
                    value={row.key || ""}
                    onChange={(e) =>
                      handleKeyValueChange(field.name, idx, "key", e.target.value)
                    }
                    className="flex-1 min-w-0 px-2.5 py-1.5 bg-[var(--surface-muted)] border border-[var(--border)] rounded-lg outline-none text-xs text-[var(--text)]"
                  />
                  <input
                    type="text"
                    placeholder="Value"
                    value={row.value || ""}
                    onChange={(e) =>
                      handleKeyValueChange(field.name, idx, "value", e.target.value)
                    }
                    className="flex-1 min-w-0 px-2.5 py-1.5 bg-[var(--surface-muted)] border border-[var(--border)] rounded-lg outline-none text-xs text-[var(--text)]"
                  />
                  <Button
                    variant="danger"
                    size="sm"
                    type="button"
                    icon={Trash2}
                    onClick={() => handleRemoveKeyValueRow(field.name, idx)}
                    aria-label="Delete row"
                  />
                </div>
              ))}
              {rows.length === 0 && (
                <div className="text-[11px] text-[var(--text-muted)] italic py-1">
                  No attributes defined yet. Click "Add Row" to add.
                </div>
              )}
            </div>
          </div>
        );

      case "image":
        return (
          <div key={field.name} className={colClass}>
            <label className="font-bold text-[var(--text)] block mb-1 text-xs">
              {field.label}
            </label>
            <div className="flex gap-2 items-center">
              <input
                type="text"
                value={rawValue}
                onChange={(e) => handleFieldChange(field.name, e.target.value)}
                placeholder="Image URL (https://...)"
                className="flex-1 px-3 py-2 bg-[var(--surface-muted)] border border-[var(--border)] rounded-xl outline-none text-xs text-[var(--text)]"
              />
              {rawValue && (
                <img
                  src={rawValue}
                  alt="Preview"
                  className="w-9 h-9 rounded-lg object-cover border border-[var(--border)]"
                  onError={(e) => ((e.target as HTMLElement).style.display = "none")}
                />
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[var(--surface)] rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col border border-[var(--border)]">
        {/* MODAL HEADER */}
        <div className="p-4 sm:p-5 border-b border-[var(--border)] flex items-start justify-between gap-3 bg-[var(--surface-muted)] shrink-0">
          <div className="min-w-0">
            <h3 className="font-bold text-[var(--text)] text-base">
              {formMode === "add"
                ? `Add New ${itemTypeLabel}`
                : `Edit ${itemTypeLabel} Details`}
            </h3>
            <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
              Configure parameters, status, and attributes for this {itemTypeLabel.toLowerCase()}.
            </p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            icon={X}
            onClick={onClose}
            aria-label="Close modal"
          />
        </div>

        {error && (
          <div className="mx-4 sm:mx-6 mt-4 p-3 text-xs text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2 shrink-0">
             <span className="font-semibold text-red-500 text-sm">Error:</span>
             <span>{error}</span>
          </div>
        )}

        {/* MODAL DYNAMIC FORM BODY */}
        <form
          id="itemFormModal"
          onSubmit={handleSave}
          className="p-4 sm:p-6 space-y-6 overflow-y-auto flex flex-col flex-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-button]:hidden [&::-webkit-scrollbar-track]:bg-[var(--surface-muted)] [&::-webkit-scrollbar-thumb]:bg-[var(--primary)] [&::-webkit-scrollbar-thumb]:rounded-full"
        >
          {groupedSections.length > 0 ? (
            groupedSections.map((section) => (
              <div key={section.title} className="space-y-3">
                <h4 className="font-bold border-b border-[var(--border)] pb-1.5 uppercase tracking-wider text-[10px] text-[var(--primary)]">
                  {section.title}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {section.fields.map(renderField)}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-xs text-[var(--text-muted)]">
              No form fields configured for this page.
            </div>
          )}
        </form>

        {/* MODAL ACTIONS */}
        <div className="p-3 sm:p-4 border-t border-[var(--border)] flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 bg-[var(--surface-muted)] shrink-0">
          <Button variant="outline" size="md" type="button" onClick={onClose}>
            Cancel
          </Button>

          <Button type="submit" form="itemFormModal" variant="primary" size="md">
            {formMode === "add" ? `Create ${itemTypeLabel}` : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FormModal;