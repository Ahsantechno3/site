// components/ui/DetailPanel.tsx
import React, { useState } from "react";
import { X, Package, Star, Pencil, Trash2 } from "lucide-react";
import Button from "@/components/ui/Button";

export interface DetailSpecification {
  key: string;
  value: string;
}

export interface DetailPanelData {
  id: string | number;
  title: string;
  sku?: string;
  status?: string;
  image?: string;
  gallery?: string[];
  price?: number;
  salePrice?: number;
  discount?: number;
  rating?: number;
  reviewsCount?: number;
  shortDescription?: string;
  description?: string;
  tags?: string[];
  specifications?: DetailSpecification[];
  attributes?: Record<string, string | number | boolean | null | undefined>;
}

export interface DetailPanelProps<T extends DetailPanelData> {
  selectedItem?: T | null;
  onClose?: () => void;
  panelTitle?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  onEdit?: (item: T) => void;
  onDelete?: (id: string | number) => void;
  editLabel?: string;
  deleteLabel?: string;
  renderCustomActions?: (item: T) => React.ReactNode;
}

export function DetailPanel<T extends DetailPanelData>({
  selectedItem,
  onClose,
  panelTitle = "Item Details",
  emptyTitle = "No Item Selected",
  emptyDescription = "Click on any record from the list to view its complete details.",
  onEdit,
  onDelete,
  editLabel = "Edit",
  deleteLabel = "Delete",
  renderCustomActions,
}: DetailPanelProps<T>) {
  const [activeImage, setActiveImage] = useState<string | null>(null);

  // Selected item change hone par image reset karein
  const currentImage = activeImage || selectedItem?.image;

  return (
    <aside className="w-full lg:min-w-78 lg:max-w-84 lg:h-full bg-[var(--surface)] flex flex-col z-10 overflow-hidden rounded-xl">
      {selectedItem ? (
        <>
          {/* Scrollable Container */}
          <div className="p-3 lg:pr-1 overflow-y-auto flex flex-col space-y-3 flex-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-[var(--surface)] [&::-webkit-scrollbar-thumb]:bg-[var(--primary)] [&::-webkit-scrollbar-thumb]:rounded-full border border-[var(--border)] rounded-b-none rounded-xl  lg:pr-3">
            {/* Split Layout */}
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border)] shrink-0">
              <h3 className="font-bold text-[var(--text)] text-sm">
                {panelTitle}
              </h3>
              {onClose && (
                <button
                  onClick={onClose}
                  className="text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer p-1 rounded-lg hover:bg-[var(--background)] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="flex flex-col gap-3 md:flex-row lg:flex-col">
              {/* Media & Key Header Stats */}
              <div className="w-full md:w-5/12 lg:w-full space-y-2 shrink-0 bg-[var(--background)] rounded-2xl p-2">
                {selectedItem.image && (
                  <div className="h-44 md:h-48 flex items-center justify-center overflow-hidden border border-[var(--border)] bg-[var(--surface)] rounded-2xl">
                    <img
                      src={currentImage}
                      alt={selectedItem.title}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                )}

                {selectedItem.gallery && selectedItem.gallery.length > 0 && (
                  <div className="flex items-center gap-2 overflow-x-auto pt-1">
                    {selectedItem.gallery.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        onClick={() => setActiveImage(img)}
                        className={`w-10 h-10 shrink-0 rounded-lg object-cover border cursor-pointer transition-all ${
                          currentImage === img
                            ? "border-[var(--primary)] ring-2 ring-[var(--primary-light)]"
                            : "border-[var(--border)] hover:border-[var(--text-muted)]"
                        }`}
                        alt=""
                      />
                    ))}
                  </div>
                )}

                {/* Title, SKU & Status */}
                <div className="flex items-start justify-between gap-2 pt-1">
                  <div className="min-w-0">
                    <h4
                      className="font-bold text-[var(--text)] text-sm truncate"
                      title={selectedItem.title}
                    >
                      {selectedItem.title}
                    </h4>
                    <div className="text-[10px] text-[var(--text-muted)] flex items-center gap-2">
                      <span>ID: #{selectedItem.id}</span>
                      {selectedItem.sku && (
                        <>
                          <span>•</span>
                          <span className="truncate" title={selectedItem.sku}>
                            SKU: {selectedItem.sku}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {selectedItem.status && (
                    <span className="shrink-0 px-2 py-0.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full font-bold text-[10px] capitalize">
                      {selectedItem.status}
                    </span>
                  )}
                </div>

                {/* Pricing & Rating */}
                {(selectedItem.salePrice !== undefined ||
                  selectedItem.price !== undefined ||
                  selectedItem.rating !== undefined) && (
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      {selectedItem.salePrice !== undefined && (
                        <span className="text-xl font-extrabold text-[var(--primary)]">
                          ${selectedItem.salePrice.toFixed(2)}
                        </span>
                      )}

                      {selectedItem.price !== undefined &&
                        selectedItem.price > 0 && (
                          <span className="text-[var(--text-muted)] line-through text-[10px]">
                            ${selectedItem.price.toFixed(2)}
                          </span>
                        )}

                      {selectedItem.discount ? (
                        <span className="bg-red-500/10 text-red-500 border border-red-500/20 text-[9px] font-bold px-1.5 py-0.5 rounded">
                          -{selectedItem.discount}%
                        </span>
                      ) : null}
                    </div>

                    {selectedItem.rating !== undefined && (
                      <span className="flex items-center gap-1 font-semibold text-[var(--text)] text-xs">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        {selectedItem.rating} ({selectedItem.reviewsCount || 0})
                      </span>
                    )}
                  </div>
                )}

                {/* Short Description */}
                {selectedItem.shortDescription && (
                  <div className="bg-[var(--surface)] p-2 rounded-lg border border-[var(--border)]">
                    <span className="text-[10px] font-bold text-[var(--text-muted)] block mb-0.5 uppercase tracking-wider">
                      Summary
                    </span>
                    <p
                      className="text-xs text-[var(--text)] line-clamp-2 cursor-help"
                      title={selectedItem.shortDescription}
                    >
                      {selectedItem.shortDescription}
                    </p>
                  </div>
                )}
              </div>

              {/* Attributes & Specifications Section */}
              <div className="w-full md:w-7/12 lg:w-full space-y-3">
                {selectedItem.attributes &&
                  Object.keys(selectedItem.attributes).length > 0 && (
                    <>
                      <span className="text-[10px] font-bold text-[var(--text-muted)] block mb-1 uppercase tracking-wider border-t md:border-transparent lg:border-[var(--border)] border-[var(--border)] pt-2 md:p-0 lg:pt-2">
                        Basic Info
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-x-3 gap-y-2 text-xs">
                        {Object.entries(selectedItem.attributes).map(
                          ([attrKey, attrVal]) => (
                            <div
                              key={attrKey}
                              className="flex justify-between gap-3 bg-[var(--background)] p-1.5 rounded border border-[var(--border)]"
                            >
                              <span className="text-[var(--text-muted)] capitalize">
                                {attrKey.replace(/([A-Z])/g, " $1")}
                              </span>
                              <span
                                className="font-semibold text-[var(--text)] text-right truncate max-w-[140px]"
                                title={String(attrVal ?? "-")}
                              >
                                {typeof attrVal === "boolean"
                                  ? attrVal
                                    ? "Yes"
                                    : "No"
                                  : (attrVal ?? "-")}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </>
                  )}

                {/* Tags */}
                {selectedItem.tags && selectedItem.tags.length > 0 && (
                  <div className="flex justify-between items-start gap-2 pt-1">
                    <span className="text-[var(--text-muted)] shrink-0 text-xs">
                      Tags
                    </span>
                    <div className="flex flex-wrap gap-1 justify-end max-w-[220px]">
                      {selectedItem.tags.map((tag) => (
                        <span
                          key={tag}
                          title={tag}
                          className="bg-[var(--background)] text-[var(--text)] px-1.5 py-0.5 rounded text-[10px] font-semibold border border-[var(--border)] truncate max-w-[100px]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Specifications */}
                {selectedItem.specifications &&
                  selectedItem.specifications.length > 0 && (
                    <div className="pt-2 border-t border-[var(--border)]">
                      <span className="text-[10px] font-bold text-[var(--text-muted)] block mb-1 uppercase tracking-wider">
                        Specifications
                      </span>
                      <div className="space-y-1">
                        {selectedItem.specifications.map((spec, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between gap-2 text-[11px] bg-[var(--background)] px-2 py-1 rounded border border-[var(--border)]"
                          >
                            <span
                              className="font-medium text-[var(--text-muted)] truncate max-w-[120px]"
                              title={spec.key}
                            >
                              {spec.key}
                            </span>
                            <span
                              className="font-bold text-[var(--text)] truncate max-w-[140px]"
                              title={spec.value}
                            >
                              {spec.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Full Description */}
                {selectedItem.description && (
                  <div className="pt-2 border-t border-[var(--border)]">
                    <span className="text-[10px] font-bold text-[var(--text-muted)] block mb-0.5 uppercase tracking-wider">
                      Description
                    </span>
                    <p
                      className="text-[11px] text-[var(--text)] leading-relaxed line-clamp-3 cursor-help bg-[var(--background)] p-2 rounded border border-[var(--border)]"
                      title={selectedItem.description}
                    >
                      {selectedItem.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-3 lg:px-3 border-t border-[var(--border)] flex flex-col sm:flex-row lg:flex-row items-center gap-3 bg-[var(--surface)] shrink-0">
            {renderCustomActions ? (
              renderCustomActions(selectedItem)
            ) : (
              <>
                {onEdit && (
                  <Button
                    variant="secondary"
                    size="md"
                    icon={Pencil}
                    fullWidth
                    onClick={() => onEdit(selectedItem)}
                  >
                    {editLabel}
                  </Button>
                )}

                {onDelete && (
                  <Button
                    variant="danger"
                    size="md"
                    icon={Trash2}
                    fullWidth
                    onClick={() => onDelete(selectedItem.id)}
                  >
                    {deleteLabel}
                  </Button>
                )}
              </>
            )}
          </div>
        </>
      ) : (
        /* Empty State */
        <div className="p-6  flex flex-col items-center justify-center text-center flex-1">
          <div className="w-14 h-14 bg-[var(--primary-light)] text-[var(--primary)] rounded-2xl flex items-center justify-center mb-3">
            <Package className="w-7 h-7" />
          </div>

          <h4 className="font-bold text-[var(--text)] text-sm mb-1">
            {emptyTitle}
          </h4>

          <p className="text-[var(--text-muted)] text-[11px] max-w-50">
            {emptyDescription}
          </p>
        </div>
      )}
    </aside>
  );
}