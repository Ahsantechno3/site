// components/ui/CreateTable.tsx
import React, { useState } from "react";

interface CreateTableProps<T extends Record<string, any>> {
  data: T[];
  selectedItem?: T | null;
  onSelectItem?: (item: T) => void;
  // Dynamic column render optional override ke liye (agar header title human-readable dene hon)
  columnHeaders?: { [key in keyof T]?: string };
}

export function CreateTable<T extends Record<string, any>>({
  data,
  selectedItem: externalSelectedItem,
  onSelectItem,
  columnHeaders,
}: CreateTableProps<T>) {
  // Local state agar parent component selection state control na kar raha ho
  const [internalSelectedItem, setInternalSelectedItem] = useState<T | null>(null);

  // Parent prop (externalSelectedItem) ko priority do, warna local state use karo
  const currentSelectedItem = externalSelectedItem !== undefined ? externalSelectedItem : internalSelectedItem;

  // Check if data exists
  const hasData = Array.isArray(data) && data.length > 0;

  // Automatically extract column keys from first JSON object
  const columns = hasData ? (Object.keys(data[0]) as Array<keyof T>) : [];

  const handleRowClick = (item: T) => {
    setInternalSelectedItem(item);
    if (onSelectItem) {
      onSelectItem(item);
    }
  };

  return (
    <div className="overflow-x-auto overflow-y-auto min-w-full flex-1 scrollbar-thin [scrollbar-color:var(--primary)_var(--surface)] [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-(--surface) [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-(--primary)">
      <table className="w-full min-w-170 text-left border-collapse">
        <thead className="bg-(--surface) border-b border-(--border) text-(--text-muted) font-semibold sticky top-0 z-10 text-[11px] uppercase">
          <tr>
            {columns.map((colKey, index) => (
              <th key={String(colKey) + index} className="p-3">
                <div className="flex items-center gap-1 cursor-pointer select-none">
                  {columnHeaders?.[colKey] ?? String(colKey)}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-(--border)/60 text-xs">
          {hasData ? (
            data.map((item, index) => {
              // Exact Reference Match for selection
              const isSelected = currentSelectedItem === item;

              const defaultBg =
                index % 2 === 0
                  ? "bg-(--background)/40"
                  : "bg-(--primary-soft)";

              // Selected state ke liye alag highlight style
              const rowBgClass = isSelected
                ? "bg-(--primary-light) font-medium border-b-(--primary)"
                : defaultBg;

              return (
                <tr
                  key={index}
                  onClick={() => handleRowClick(item)}
                  className={`cursor-pointer transition-colors hover:bg-(--primary-light) ${rowBgClass}`}
                >
                  {columns.map((colKey, idx) => (
                    <td key={String(colKey) + idx} className="p-2">
                      {item[colKey] !== undefined && item[colKey] !== null
                        ? String(item[colKey])
                        : "-"}
                    </td>
                  ))}
                </tr>
              );
            })
          ) : (
            <tr>
              <td
                colSpan={columns.length || 1}
                className="p-10 text-center text-(--text-muted)"
              >
                No record found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}