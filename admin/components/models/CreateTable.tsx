// components/ui/CreateTable.tsx
import React, { useState } from "react";

export interface CreateTableProps<T extends Record<string, any>> {
  data: T[];
  selectedItem?: T | null;
  onSelectItem?: (item: T) => void;
  columnHeaders?: { [key in keyof T]?: string };
}

// Helper function to truncate long MongoDB or UUID IDs
const formatId = (idValue: any): string => {
  const str = String(idValue || "");
  if (str.length > 10) {
    return `${str.slice(0, 6)}...${str.slice(-4)}`;
  }
  return str;
};

export function CreateTable<T extends Record<string, any>>({
  data,
  selectedItem: externalSelectedItem,
  onSelectItem,
  columnHeaders,
}: CreateTableProps<T>) {
  const [internalSelectedItem, setInternalSelectedItem] = useState<T | null>(null);

  const currentSelectedItem =
    externalSelectedItem !== undefined ? externalSelectedItem : internalSelectedItem;

  const hasData = Array.isArray(data) && data.length > 0;

  // Filter out separate image/url columns if present in headers
  const columns = (
    columnHeaders
      ? (Object.keys(columnHeaders) as Array<keyof T>)
      : hasData
      ? (Object.keys(data[0]) as Array<keyof T>)
      : []
  ).filter((colKey) => {
    const keyStr = String(colKey).toLowerCase();
    return keyStr !== "image" && keyStr !== "images" && keyStr !== "url";
  });

  const handleRowClick = (item: T) => {
    setInternalSelectedItem(item);
    if (onSelectItem) {
      onSelectItem(item);
    }
  };

  return (
    <div className="overflow-auto flex-1 w-full h-full [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-[var(--surface)] [&::-webkit-scrollbar-thumb]:bg-[var(--primary)] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-button]:hidden relative max-h-64">
      <table className="w-full min-w-170 text-left border-collapse">
        <thead className="bg-[var(--surface)] border-b border-[var(--border)] text-[var(--text-muted)] font-semibold sticky top-0 z-10 text-[11px] uppercase">
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

        <tbody className="divide-y divide-[var(--border)] text-xs text-[var(--text)]">
          {hasData ? (
            data.map((item, index) => {
              const isSelected = currentSelectedItem === item;

              const defaultBg =
                index % 2 === 0
                  ? "bg-[var(--background)]"
                  : "bg-[var(--surface)]";

              const rowBgClass = isSelected
                ? "bg-[var(--primary-light)] font-medium border-b-[var(--primary)]"
                : defaultBg;

              return (
                <tr
                  key={index}
                  onClick={() => handleRowClick(item)}
                  className={`cursor-pointer transition-colors hover:bg-[var(--primary-light)] ${rowBgClass}`}
                >
                  {columns.map((colKey, idx) => {
                    const rawValue = item[colKey];
                    const colKeyStr = String(colKey).toLowerCase();

                    // 1. ID Column (Truncate long IDs)
                    if (colKeyStr === "_id" || colKeyStr === "id") {
                      return (
                        <td
                          key={String(colKey) + idx}
                          className="p-2 align-middle font-mono text-[11px] text-[var(--text-muted)] whitespace-nowrap"
                          title={String(rawValue)}
                        >
                          {formatId(rawValue)}
                        </td>
                      );
                    }

                    // 2. Product Name Column (Combine Image + Name)
                    if (
                      colKeyStr === "name" ||
                      colKeyStr === "productname" ||
                      colKeyStr === "title"
                    ) {
                      const imgUrl = item.image || item.url || item.productImage;
                      const isUrl =
                        typeof imgUrl === "string" &&
                        (imgUrl.startsWith("http") ||
                          imgUrl.startsWith("/") ||
                          imgUrl.startsWith("data:image"));

                      return (
                        <td key={String(colKey) + idx} className="p-2 align-middle">
                          <div className="flex items-center gap-2.5">
                            {/* Small Square Image Box */}
                            <div className="w-8 h-8 rounded-md border border-[var(--border)]/40 bg-[var(--surface-muted)] flex items-center justify-center overflow-hidden shrink-0">
                              {isUrl ? (
                                <img
                                  src={imgUrl}
                                  alt={String(rawValue || "Product")}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = "none";
                                    if (target.parentElement) {
                                      target.parentElement.innerText = "N/A";
                                    }
                                  }}
                                />
                              ) : (
                                <span className="text-[10px] text-[var(--text-muted)] font-bold">
                                  N/A
                                </span>
                              )}
                            </div>

                            {/* Product Name Text */}
                            <span className="font-medium text-[var(--text)] line-clamp-2">
                              {rawValue !== undefined && rawValue !== null
                                ? String(rawValue)
                                : "-"}
                            </span>
                          </div>
                        </td>
                      );
                    }

                    // 3. Standard Cells
                    return (
                      <td key={String(colKey) + idx} className="p-2 align-middle">
                        {rawValue !== undefined && rawValue !== null
                          ? String(rawValue)
                          : "-"}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          ) : (
            <tr>
              <td
                colSpan={columns.length || 1}
                className="p-10 text-center text-[var(--text-muted)] bg-[var(--surface)]"
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