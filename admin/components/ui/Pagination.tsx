"use client";

import React, { useEffect } from "react";
import CustomSelectUp from "@/c2/ui/Select";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps<T> {
  data: T[]; // Full filtered data array from ProductsView
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (size: number) => void;
  onPaginatedDataChange: (paginatedData: T[]) => void;
  perPageOptions?: { label: string; value: string }[];
}

export function Pagination<T>({
  data,
  currentPage,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  onPaginatedDataChange,
  perPageOptions = [
    { label: "50", value: "50" },
    { label: "20", value: "20" },
    { label: "10", value: "10" },
    { label: "5", value: "5" },
  ],
}: PaginationProps<T>) {
  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Auto Reset or Adjust Page boundary when data or page size changes
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      onPageChange(totalPages);
    }
  }, [currentPage, totalPages, onPageChange]);

  // Compute paginated slice and push it up to parent/CreateTable
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const slicedData = data.slice(startIndex, startIndex + itemsPerPage);
    onPaginatedDataChange(slicedData);
  }, [data, currentPage, itemsPerPage, onPaginatedDataChange]);

  const handlePageChange = (page: number) => {
    if (page < 1 || (totalPages > 0 && page > totalPages)) return;
    onPageChange(page);
  };

  const getPaginationRange = (current: number, total: number) => {
    const maxVisiblePages = 5;
    if (total <= maxVisiblePages) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    if (current <= 3) {
      return [1, 2, 3, 4, "...", total];
    }
    if (current >= total - 2) {
      return [1, "...", total - 3, total - 2, total - 1, total];
    }
    return [1, "...", current - 1, current, current + 1, "...", total];
  };

  return (
    <div
      className="border-t px-3 sm:px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0"
      style={{
        borderColor: "var(--border)",
        backgroundColor: "var(--background)",
      }}
    >
      <div
        className="text-[11px] text-center sm:text-left"
        style={{ color: "var(--text-muted)" }}
      >
        Showing{" "}
        <span className="font-bold" style={{ color: "var(--text)" }}>
          {totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}
        </span>{" "}
        to{" "}
        <span className="font-bold" style={{ color: "var(--text)" }}>
          {Math.min(currentPage * itemsPerPage, totalItems)}
        </span>{" "}
        of{" "}
        <span className="font-bold" style={{ color: "var(--text)" }}>
          {totalItems}
        </span>{" "}
        products
      </div>

      <div className="flex items-center gap-3">
        <div
          className="flex items-center gap-1.5 text-[11px]"
          style={{ color: "var(--text-muted)" }}
        >
          <span>Per page:</span>
          <CustomSelectUp
            value={itemsPerPage.toString()}
            options={perPageOptions}
            onChange={(val) => onItemsPerPageChange(Number(val))}
            className="w-16"
          />
        </div>

        {totalPages > 0 && (
          <div className="flex items-center gap-1 flex-wrap justify-center">
            <button
              type="button"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              style={{
                borderColor: "var(--border)",
                color: currentPage === 1 ? "var(--text-muted)" : "var(--text)",
              }}
              className={`w-7 h-7 flex items-center justify-center rounded-lg border text-xs transition-colors ${
                currentPage === 1
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:opacity-80 cursor-pointer"
              }`}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            {getPaginationRange(currentPage, totalPages).map((page, index) => {
              if (page === "...") {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    style={{ color: "var(--text-muted)" }}
                    className="w-7 h-7 flex items-center justify-center text-[11px] select-none"
                  >
                    ...
                  </span>
                );
              }

              const pageNum = page as number;
              const isActive = currentPage === pageNum;

              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => handlePageChange(pageNum)}
                  style={
                    isActive
                      ? {
                          backgroundColor: "var(--primary)",
                          color: "#ffffff",
                        }
                      : {
                          borderColor: "var(--border)",
                          color: "var(--text)",
                        }
                  }
                  className={`w-7 h-7 flex items-center justify-center rounded-lg text-[11px] cursor-pointer transition-all ${
                    isActive
                      ? "font-bold shadow-sm"
                      : "border hover:opacity-80 font-semibold"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={{
                borderColor: "var(--border)",
                color:
                  currentPage === totalPages
                    ? "var(--text-muted)"
                    : "var(--text)",
              }}
              className={`w-7 h-7 flex items-center justify-center rounded-lg border text-xs transition-colors ${
                currentPage === totalPages
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:opacity-80 cursor-pointer"
              }`}
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Pagination;