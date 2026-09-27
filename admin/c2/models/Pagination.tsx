"use client";

import React from "react";
import CustomSelectUp from "@/c2/ui/Select"; // Path check kar lein
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems?: number; // Optional: agar text me total dikhana ho
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  perPageOptions?: { label: string; value: string }[];
}

export function Pagination({
  currentPage = 1,
  totalPages = 1,
  itemsPerPage = 10,
  totalItems,
  onPageChange,
  onItemsPerPageChange,
  perPageOptions = [
    { label: "50", value: "50" },
    { label: "20", value: "20" },
    { label: "10", value: "10" },
    { label: "5", value: "5" },
  ],
}: PaginationProps) {

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    onPageChange(page);
  };

  // Exact Dynamic Sequence Logic
  const getPaginationRange = (current: number, total: number) => {
    if (total <= 5) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    // Rule 1: Initial Pages -> >1 2 3 4 ... total
    if (current <= 2) {
      return [1, 2, 3, 4, "...", total];
    }

    // Rule 2: Page 3 -> 1 >3 4 5 ... total
    if (current === 3) {
      return [1, 3, 4, 5, "...", total];
    }

    // Rule 3: Last Pages -> 1 ... (total-3) (total-2) (total-1) >total
    if (current >= total - 2) {
      return [1, "...", total - 3, total - 2, total - 1, total];
    }

    // Rule 4: Middle Pages -> 1 ... >22 23 24 ... total
    return [1, "...", current - 1, current, current + 1, "...", total];
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = totalItems ? Math.min(currentPage * itemsPerPage, totalItems) : currentPage * itemsPerPage;

  return (
    <div
      className="py-3 flex flex-row flex-wrap justify-between items-center gap-3 w-full bg-[var(--surface)] border-[var(--border)]"
    >
      {/* Left Info Text */}
      <div
        className="text-[11px] text-center sm:text-left shrink-0 text-[var(--text-muted)]"
      >
        Showing{" "}
        <span className="font-bold text-[var(--text)]">
          {startItem}
        </span>{" "}
        to{" "}
        <span className="font-bold text-[var(--text)]">
          {endItem}
        </span>
        {totalItems ? (
          <>
            {" "}of{" "}
            <span className="font-bold text-[var(--text)]">
              {totalItems.toLocaleString()}
            </span>
          </>
        ) : null}{" "}
        products
      </div>

      {/* Right Controls Container */}
      <div className="flex flex-wrap items-center w-full md:w-fit justify-between md:justify-normal gap-3">
        {/* Dropdown */}
        <div
          className="flex items-center gap-1.5 shrink-0 text-[11px] text-[var(--text-muted)]"
        >
          <span>Per page:</span>
          <CustomSelectUp
            value={itemsPerPage.toString()}
            options={perPageOptions}
            onChange={(val) => onItemsPerPageChange(Number(val))}
            className="w-16"
            direction="top"
            size="sm"
          />
        </div>

        {/* Buttons List */}
        <div className="flex items-center gap-1 shrink-0 flex-wrap justify-center">
          {/* Previous Arrow */}
          <button
            type="button"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`w-7 h-7 flex items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text)] text-xs transition-colors ${
              currentPage === 1
                ? "opacity-40 cursor-not-allowed text-[var(--text-muted)]"
                : "hover:opacity-80 cursor-pointer"
            }`}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          {/* Numbers / Dots */}
          {getPaginationRange(currentPage, totalPages).map((page, index) => {
            if (page === "...") {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="w-3.5 h-3.5 flex items-center justify-center text-[11px] select-none text-[var(--text-muted)]"
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
                className={`w-7 h-7 flex items-center justify-center rounded-lg text-[11px] cursor-pointer transition-all ${
                  isActive
                    ? "bg-[var(--primary)] text-[var(--primary-text,#ffffff)] font-bold shadow-sm"
                    : "border border-[var(--border)] text-[var(--text)] hover:opacity-80 font-semibold"
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          {/* Next Arrow */}
          <button
            type="button"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`w-7 h-7 flex items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text)] text-xs transition-colors ${
              currentPage === totalPages
                ? "opacity-40 cursor-not-allowed text-[var(--text-muted)]"
                : "hover:opacity-80 cursor-pointer"
            }`}
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Pagination;