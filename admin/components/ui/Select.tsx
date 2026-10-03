"use client";

import React, { useEffect, useRef, useState, ComponentPropsWithoutRef } from "react";
import { Check, ChevronDown } from "lucide-react";

// Types Definition
export type SelectVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
export type SelectSize = "sm" | "md" | "lg";
export type DropdownDirection = "top" | "bottom";

export interface SelectOption {
  label: string;
  value: string;
}

const variantStyles: Record<SelectVariant, string> = {
  primary: "bg-[var(--primary)] hover:opacity-90 text-[var(--primary-text,#ffffff)] shadow-2xs",
  secondary: "bg-[var(--surface-muted)] hover:bg-[var(--surface-hover,var(--surface))] text-[var(--text)] border border-[var(--border)] shadow-2xs",
  outline: "bg-[var(--surface)] hover:bg-[var(--surface-muted)] text-[var(--text)] border border-[var(--border)]",
  ghost: "bg-transparent hover:bg-[var(--surface-muted)] text-[var(--text-muted)]",
  danger: "bg-[var(--surface)] hover:bg-red-50 text-red-600 border border-red-200",
};

const sizeStyles: Record<SelectSize, string> = {
  sm: "px-1 py-1 text-xs rounded-lg gap-0.5",
  md: "px-2 py-1.5 text-sm rounded-lg gap-1",
  lg: "px-3.5 py-2 text-base rounded-lg gap-1.5",
};

export interface SelectProps extends Omit<ComponentPropsWithoutRef<"button">, "onChange" | "value"> {
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  variant?: SelectVariant;
  size?: SelectSize;
  fullWidth?: boolean;
  direction?: DropdownDirection;
}

const Select: React.FC<SelectProps> = ({
  value,
  options,
  onChange,
  placeholder = "Select option",
  className = "",
  variant = "secondary",
  size = "md",
  fullWidth = false,
  direction = "bottom",
  disabled = false,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Menu direction styling logic
  const dropdownDirectionClasses =
    direction === "top"
      ? "bottom-full mb-1"
      : "top-full mt-1";

  return (
    <div
      ref={dropdownRef}
      className={`relative text-left ${fullWidth ? "w-full" : "inline-block"} ${className}`}
    >
      {/* Dynamic Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`font-semibold inline-flex items-center justify-between transition-colors cursor-pointer focus:shadow-2xl ${
          variantStyles[variant] || variantStyles.secondary
        } ${sizeStyles[size] || sizeStyles.md} ${
          fullWidth ? "w-full" : ""
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        {...props}
      >
        <span className="inline-flex items-center gap-1.5 truncate">
          <span className="truncate font-medium">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </span>
        <ChevronDown
          className={`w-3 h-3 ml-0.5 transition-transform duration-200 shrink-0 opacity-70 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Options List */}
      {isOpen && (
        <div
          className={`absolute right-0 left-0 z-50 bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-lg max-h-56 overflow-y-auto py-1 animate-in fade-in zoom-in-95 duration-100 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-button]:hidden [&::-webkit-scrollbar-track]:bg-[var(--surface-muted)] [&::-webkit-scrollbar-thumb]:bg-[var(--primary)] [&::-webkit-scrollbar-thumb]:rounded-full ${dropdownDirectionClasses}`}
        >
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between cursor-pointer transition-colors ${
                  isSelected
                    ? "bg-[var(--primary-light,var(--surface-muted))] text-[var(--primary)] font-bold"
                    : "text-[var(--text)] hover:bg-[var(--surface-muted)]"
                }`}
              >
                <span className="truncate">{option.label}</span>
                {isSelected && (
                  <Check className="w-3.5 h-3.5 text-[var(--primary)] shrink-0 ml-2" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Select;