"use client";

import React, { useState, useEffect, useRef, ComponentPropsWithoutRef } from "react";
import { Search } from "lucide-react";

// Generic Interface inside Child Component
export interface SearchableEntityRecord {
  id: string | number;
  [key: string]: any;
}

export type SearchBarVariant = "primary" | "secondary" | "outline" | "ghost";
export type SearchBarSize = "sm" | "md" | "lg";

const variantStyles: Record<SearchBarVariant, string> = {
  primary: "bg-[var(--primary)] text-[var(--primary-text,#ffffff)] placeholder:text-[var(--primary-text,#ffffff)]/70 border border-transparent",
  secondary: "bg-[var(--surface-muted)] text-[var(--text)] placeholder:text-[var(--text-muted)] border border-[var(--border)]",
  outline: "bg-[var(--surface)] text-[var(--text)] placeholder:text-[var(--text-muted)] border border-[var(--border)] focus:ring-2 focus:ring-[var(--primary)]",
  ghost: "bg-transparent text-[var(--text-muted)] placeholder:text-[var(--text-muted)] border border-transparent hover:bg-[var(--surface-muted)]",
};

const sizeStyles: Record<SearchBarSize, { container: string; input: string; icon: string; kbd: string }> = {
  sm: {
    container: "rounded-lg text-xs",
    input: "pl-7 pr-1 py-1 text-xs",
    icon: "w-3 h-3 left-2.5",
    kbd: "right-2 px-1 py-0.2 text-[8px]",
  },
  md: {
    container: "rounded-lg text-sm",
    input: "pl-8 pr-1 py-1.5 text-sm",
    icon: "w-3.5 h-3.5 left-3",
    kbd: "right-2.5 px-1.5 py-0.5 text-[9px]",
  },
  lg: {
    container: "rounded-xl text-base",
    input: "pl-9 pr-1 py-2 text-base",
    icon: "w-4 h-4 left-3",
    kbd: "right-3 px-2 py-0.5 text-[10px]",
  },
};

export interface SearchBarProps<TSearchData extends SearchableEntityRecord>
  extends Omit<ComponentPropsWithoutRef<"input">, "onChange" | "size"> {
  searchSourceData: TSearchData[];
  searchableFieldsKeys: (keyof TSearchData)[];
  onSearchResultsUpdate: (filteredSearchData: TSearchData[]) => void;
  searchPlaceholder?: string;
  searchVariant?: SearchBarVariant;
  searchSize?: SearchBarSize;
  isFullWidthSearch?: boolean;
  showShortcut?: boolean;
  debounceDelay?: number;
}

export const SearchBar = <TSearchData extends SearchableEntityRecord>({
  searchSourceData,
  searchableFieldsKeys,
  onSearchResultsUpdate,
  searchPlaceholder = "Search...",
  searchVariant = "secondary",
  searchSize = "md",
  isFullWidthSearch = false,
  showShortcut = true,
  debounceDelay = 300,
  disabled = false,
  className = "",
  ...props
}: SearchBarProps<TSearchData>) => {
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!showShortcut) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "/") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showShortcut]);

  const searchKeysHash = JSON.stringify(searchableFieldsKeys);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (!searchQuery.trim()) {
        onSearchResultsUpdate(searchSourceData);
        return;
      }

      const query = searchQuery.toLowerCase().trim();

      const filtered = searchSourceData.filter((item) =>
        searchableFieldsKeys.some((key) => {
          const val = item[key];
          if (val === null || val === undefined) return false;
          return String(val).toLowerCase().includes(query);
        })
      );

      onSearchResultsUpdate(filtered);
    }, debounceDelay);

    return () => clearTimeout(handler);
  }, [searchQuery, searchKeysHash, searchSourceData, debounceDelay]);

  const activeSize = sizeStyles[searchSize] || sizeStyles.md;

  return (
    <div
      className={`relative inline-block sm:flex-1 ${
        isFullWidthSearch ? "w-full" : "w-full min-w-40 max-w-80"
      } ${className}`}
    >
      <Search
        className={`absolute text-[var(--text-muted)] top-1/2 -translate-y-1/2 opacity-70 pointer-events-none transition-colors ${activeSize.icon}`}
      />
      <input
        ref={searchInputRef}
        type="text"
        disabled={disabled}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder={searchPlaceholder}
        autoComplete="off"
        className={`w-full font-medium transition-all outline-none ${
          activeSize.container
        } ${activeSize.input} ${
          variantStyles[searchVariant] || variantStyles.secondary
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        {...props}
      />
      {showShortcut && !searchQuery && (
        <kbd
          className={`absolute top-1/2 -translate-y-1/2 font-semibold text-[var(--text-muted)] bg-[var(--surface-muted)] border border-[var(--border)] rounded pointer-events-none ${activeSize.kbd}`}
        >
          Ctrl+/
        </kbd>
      )}
    </div>
  );
};

export default SearchBar;