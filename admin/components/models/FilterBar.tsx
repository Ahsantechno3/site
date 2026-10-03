"use client";

import React, { useEffect, useState } from "react";
import { RotateCcw } from "lucide-react";
import SearchBar, { SearchableEntityRecord } from "@/components/ui/SearchBar";
import Select, {
  SelectOption,
  SelectVariant,
  SelectSize,
  DropdownDirection,
} from "@/components/ui/Select";
import Button from "@/components/ui/Button";

export interface FilterConfigItem {
  id: string;
  placeholder?: string;
  icon?: React.ElementType;
  options: SelectOption[];
  variant?: SelectVariant;
  size?: SelectSize;
  direction?: DropdownDirection;
}

export interface FilterBarProps<TSearchData extends SearchableEntityRecord> {
  // Raw Data source
  sourceData: TSearchData[];

  // Search Props
  searchableFieldsKeys: (keyof TSearchData)[];
  searchPlaceholder?: string;
  searchVariant?: "primary" | "secondary" | "outline" | "ghost";
  searchSize?: "sm" | "md" | "lg";
  showShortcut?: boolean;

  // Filter Props
  filtersData: FilterConfigItem[];

  // Consolidated Emission Callback
  onDataChange: (filteredData: TSearchData[]) => void;

  clearButtonText?: string;
}

export const FilterBar = <TSearchData extends SearchableEntityRecord>({
  sourceData,
  searchableFieldsKeys,
  searchPlaceholder = "Search...",
  searchVariant = "secondary",
  searchSize = "md",
  showShortcut = true,
  filtersData,
  onDataChange,
  clearButtonText = "Clear",
}: FilterBarProps<TSearchData>) => {
  // Internal State
  const [searchedData, setSearchedData] = useState<TSearchData[]>(sourceData);
  const [filterValues, setFilterValues] = useState<Record<string, string>>(
    () => {
      const initial: Record<string, string> = {};
      filtersData.forEach((f) => (initial[f.id] = "all"));
      return initial;
    },
  );

  // Source data change sync
  useEffect(() => {
    setSearchedData(sourceData);
  }, [sourceData]);

  // Handle single dropdown change
  const handleFilterChange = (filterId: string, selectedValue: string) => {
    setFilterValues((prev) => ({
      ...prev,
      [filterId]: selectedValue,
    }));
  };

  // Handle Clear All
  const handleClearFilters = () => {
    const resetValues: Record<string, string> = {};
    filtersData.forEach((f) => (resetValues[f.id] = "all"));
    setFilterValues(resetValues);
    setSearchedData(sourceData);
  };

  // Main Combined Filter Logic
  useEffect(() => {
    let result = searchedData;

    // Apply Active Dropdown Filters
    Object.keys(filterValues).forEach((key) => {
      const selectedVal = filterValues[key];
      if (selectedVal && selectedVal !== "all") {
        result = result.filter((item) => String(item[key]) === selectedVal);
      }
    });

    // Emit Final Filtered Result to Parent
    onDataChange(result);
  }, [searchedData, filterValues]);

  // Active Checks
  const isDropdownFilterActive = Object.values(filterValues).some(
    (value) => value && value !== "all",
  );
  const isSearchActive = searchedData.length !== sourceData.length;

  // Clear button is active only when search or filter is applied
  const isClearActive = isDropdownFilterActive || isSearchActive;

  return (
    <div className="flex flex-wrap items-center flex-col md:flex-row gap-3 w-full md:w-auto bg-[var(--surface)] text-[var(--text)]">
      {/* Dynamic Search Bar */}
      <SearchBar<TSearchData>
        className="w-full min-w-0 max-w-full md:min-w-40 md:max-w-76 lg:max-w-84 border-[var(--border)]"
        searchSourceData={sourceData}
        searchableFieldsKeys={searchableFieldsKeys}
        onSearchResultsUpdate={setSearchedData}
        searchPlaceholder={searchPlaceholder}
        searchVariant={searchVariant}
        searchSize={searchSize}
        showShortcut={showShortcut}
      />

      {/* Mapped Select Filters */}
      <div className="flex flex-row md:ml-auto w-full md:w-fit flex-wrap gap-3">
        {filtersData.map((item) => (
          <Select
            key={item.id}
            fullWidth={true}
            className="flex-1 border-[var(--border)] bg-[var(--surface)] text-[var(--text)]"
            value={filterValues[item.id] || "all"}
            options={item.options}
            onChange={(selectedValue) =>
              handleFilterChange(item.id, selectedValue)
            }
            placeholder={item.placeholder}
            variant={item.variant || "primary"}
            size={item.size || "md"}
            direction={item.direction || "bottom"}
          />
        ))}

        {/* Always Visible Clear Button */}
        <Button
          variant={`${!isClearActive ? 'ghost': 'primary'}`}
          // className="md:ml-auto flex-1 md:flex-none disabled:bg-[var(--surface)] disabled:text-[var(--text-muted)] disabled:border-[var(--border)]"
          size="md"
          icon={RotateCcw}
          onClick={handleClearFilters}
          disabled={!isClearActive}
        >
          {clearButtonText}
        </Button>
      </div>
    </div>
  );
};

export default FilterBar;