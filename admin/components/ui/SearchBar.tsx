"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";

interface SearchBarProps<T> {
  data: T[];
  searchFields: (keyof T)[];
  onSearchResults: (results: T[]) => void;
  placeholder?: string;
}

export const SearchBar = <T extends Record<string, any>>({
  data,
  searchFields,
  onSearchResults,
  placeholder = "Search...",
}: SearchBarProps<T>) => {
  const [query, setQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard Shortcut Listener (Ctrl + /)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "/") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Stable stringified version of searchFields to prevent size-change errors
  const fieldsKey = JSON.stringify(searchFields);

  // Search Algorithm & Filtering Logic
  useEffect(() => {
    if (!query.trim()) {
      onSearchResults(data);
      return;
    }

    const lowerCaseQuery = query.toLowerCase().trim();

    const filtered = data.filter((item) =>
      searchFields.some((field) => {
        const value = item[field];
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(lowerCaseQuery);
      })
    );

    onSearchResults(filtered);
  }, [query, fieldsKey]); // 👈 Depend on query and static stringified fieldsKey instead of raw array

  return (
    <div className="relative ml-1 w-full min-w-40 max-w-80 hidden md:block select-none">
      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-(--text-muted)" />
      <input
        ref={searchInputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-14 py-2 bg-(--surface) border border-(--border) text-(--text) placeholder:text-(--text-muted) rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-(--primary) transition-all"
      />
      <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-semibold text-(--text-muted) bg-(--border) rounded pointer-events-none">
        Ctrl + /
      </kbd>
    </div>
  );
};

export default SearchBar;