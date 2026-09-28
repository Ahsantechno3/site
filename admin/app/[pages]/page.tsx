// /app/[pages]/page.tsx
"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

import TopBar from "@/c2/ui/TopBar";
import StatsGrid from "@/c2/models/StatsGrid";
import TabsBar, { HeaderActionButton } from "@/c2/models/TabsBar";
import FilterBar from "@/c2/models/FilterBar";
import { CreateTable } from "@/c2/models/CreateTable";
import Pagination from "@/c2/models/Pagination";
import { DetailPanel } from "@/c2/models/DetailPanel";
import FormModal, { FormField, ItemFormData } from "@/c2/models/FormModal";
import MediaHandlerModal from "@/c2/models/MediaHandler";

import { getRouteConfigByPath } from "@/config";
import { extractApiError, PaginationMeta } from "@/services/api";
import { useAdminAuth } from "@/services/authContext";
import {
  getCapabilities,
  getResourceService,
  mediaService,
} from "@/services/resourceRegistry";
import { EntityOption, EntityOptions } from "@/services/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = Record<string, any>;

// The panel searches, filters and paginates over one fetched batch, so pull a
// generous page in a single request rather than round-tripping on each keypress.
const MAX_ROWS = 200;
const DEFAULT_PAGE_SIZE = 10;

/** Replaces config dropdown options with the live ones loaded from the API. */
function withDynamicOptions(fields: FormField[], options: EntityOptions): FormField[] {
  return fields.map((field) => {
    switch (field.name) {
      case "category":
      case "parentCategory":
        return options.categoryOptions?.length
          ? { ...field, options: options.categoryOptions }
          : field;
      case "brand":
        return options.brandOptions?.length ? { ...field, options: options.brandOptions } : field;
      case "vendor":
        return options.vendorOptions?.length ? { ...field, options: options.vendorOptions } : field;
      case "product":
        return options.productOptions?.length ? { ...field, options: options.productOptions } : field;
      case "user":
        return options.userOptions?.length ? { ...field, options: options.userOptions } : field;
      default:
        return field;
    }
  });
}

/**
 * Products must belong to a vendor (the schema requires it) but the config has
 * no vendor picker, so add one whenever the route supplies vendor options.
 */
function ensureVendorField(fields: FormField[], options: EntityOptions): FormField[] {
  if (!options.vendorOptions?.length) return fields;
  if (fields.some((field) => field.name === "vendor")) return fields;

  return [
    ...fields,
    {
      name: "vendor",
      label: "Vendor / Store",
      type: "select",
      required: true,
      colSpan: 2,
      section: "Basic Information",
      options: options.vendorOptions,
    } as FormField,
  ];
}

/** Tab labels are human readable ("Pending Review"); statuses are snake_case. */
function normaliseStatus(value: unknown): string {
  return String(value ?? "").toLowerCase().replace(/\s+/g, "_");
}

const PageLayout: React.FC = () => {
  const pathname = usePathname();
  const { isAuthenticated, isRestoring, user } = useAdminAuth();

  const currentConfig = useMemo(() => getRouteConfigByPath(pathname), [pathname]);
  const service = useMemo(() => getResourceService(pathname), [pathname]);
  const capabilities = useMemo(() => getCapabilities(service), [service]);

  const Route = currentConfig.routeTitle;
  const isMediaPage = pathname.includes("/media") || Route.toLowerCase() === "media";

  const tablist = useMemo(
    () => currentConfig.tabs || [`All ${Route}`],
    [currentConfig, Route],
  );

  // --- data state ---------------------------------------------------------
  const [items, setItems] = useState<Row[]>([]);
  const [displayItems, setDisplayItems] = useState<Row[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [options, setOptions] = useState<EntityOptions>({});
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  // --- view state ---------------------------------------------------------
  const [activeTab, setActiveTab] = useState(tablist[0] || `All ${Route}`);
  const [selectedRawRow, setSelectedRawRow] = useState<Row | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_PAGE_SIZE);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [formData, setFormData] = useState<ItemFormData>({});
  const [isSaving, setIsSaving] = useState(false);

  const reload = useCallback(() => setReloadToken((token) => token + 1), []);

  // --- fetch the list -----------------------------------------------------
  useEffect(() => {
    if (!service || !isAuthenticated) return;

    let cancelled = false;
    setIsLoading(true);
    setLoadError(null);

    service
      .list({ page: 1, limit: MAX_ROWS })
      .then(({ items: rows, meta: pageMeta }) => {
        if (cancelled) return;
        setItems(rows);
        setDisplayItems(rows);
        setMeta(pageMeta);
      })
      .catch((error) => {
        if (cancelled) return;
        setItems([]);
        setDisplayItems([]);
        setLoadError(extractApiError(error));
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [service, isAuthenticated, reloadToken]);

  // --- fetch dropdown options --------------------------------------------
  useEffect(() => {
    if (!service?.loadOptions || !isAuthenticated) return;

    let cancelled = false;
    service
      .loadOptions()
      .then((loaded) => {
        if (!cancelled) setOptions(loaded);
      })
      .catch(() => {
        /* options are optional — the static config values remain in place */
      });

    return () => {
      cancelled = true;
    };
  }, [service, isAuthenticated]);

  // Reset the view whenever the route changes.
  useEffect(() => {
    setActiveTab(currentConfig.tabs?.[0] || `All ${currentConfig.routeTitle}`);
    setSelectedRawRow(null);
    setCurrentPage(1);
    setLoadError(null);
    setNotice(null);
  }, [currentConfig]);

  // Any change to what is displayed returns to page 1.
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  // --- derived data -------------------------------------------------------
  const tabFilteredItems = useMemo(() => {
    if (activeTab === tablist[0]) return items;
    const wanted = normaliseStatus(activeTab);
    return items.filter((item) => normaliseStatus(item.status) === wanted);
  }, [items, activeTab, tablist]);

  const totalPages = Math.max(1, Math.ceil(displayItems.length / itemsPerPage));

  const pagedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return displayItems.slice(start, start + itemsPerPage);
  }, [displayItems, currentPage, itemsPerPage]);

  // The config union types each route's mappers with its own row shape, so
  // read them through one permissive signature.
  const tableMapper = (currentConfig as unknown as { mapTableData?: (row: Row) => Row })
    .mapTableData;
  const detailMapper = (
    currentConfig as unknown as { mapDetailData?: (row: Row) => Record<string, unknown> }
  ).mapDetailData;

  const formattedTableData = useMemo(() => {
    return tableMapper ? pagedItems.map((item) => tableMapper(item)) : pagedItems;
  }, [pagedItems, tableMapper]);

  const selectedDetailData = useMemo(() => {
    if (!selectedRawRow) return null;
    if (detailMapper) return detailMapper(selectedRawRow);
    return {
      id: selectedRawRow._id || selectedRawRow.id,
      title: selectedRawRow.name || "Details",
      status: selectedRawRow.status || "active",
      attributes: selectedRawRow,
    };
  }, [selectedRawRow, detailMapper]);

  const btnlist: HeaderActionButton[] = useMemo(() => {
    if (!currentConfig.buttons) return [];
    return currentConfig.buttons
      .filter((btn) => {
        if (!btn.show) return false;
        if (btn.id === "new-item") return capabilities.canCreate || isMediaPage;
        return true;
      })
      .map((btn) => ({
        id: btn.id,
        label: btn.label,
        icon: btn.icon,
        variant: btn.variant,
        disabled: btn.disabled,
      }));
  }, [currentConfig, capabilities, isMediaPage]);

  const formFields = useMemo(() => {
    // Not every route config declares form fields (media uses its own modal).
    const base = (currentConfig as { formFields?: FormField[] }).formFields || [];
    const withOptions = withDynamicOptions(base, options);
    // Only products need the vendor picker.
    return Route.toLowerCase() === "products"
      ? ensureVendorField(withOptions, options)
      : withOptions;
  }, [currentConfig, options, Route]);

  // Static fallbacks declared in the route configs, read through one shape so
  // the union of config types does not fight the props.
  const configOptions = currentConfig as unknown as {
    categoryOptions?: EntityOption[];
    brandOptions?: EntityOption[];
    statusOptions?: EntityOption[];
  };

  // --- handlers ---------------------------------------------------------

  const formMapper = (
    currentConfig as unknown as { mapFormData?: (row?: Row) => ItemFormData }
  ).mapFormData;

  const buildInitialFormValues = useCallback(
    (row?: Row): ItemFormData => {
      const mapped = formMapper ? formMapper(row) : row ? { ...row } : {};
      if (row && Route.toLowerCase() === "products") {
        // These refs are not part of the visible form but must survive the
        // round trip so an edit does not clear them.
        return {
          ...mapped,
          vendorId: row.vendorId,
          categoryId: row.categoryId,
          brandId: row.brandId,
          price: row.costPriceOverride ?? mapped.price,
        };
      }
      return mapped;
    },
    [formMapper, Route],
  );

  const handleExport = useCallback(() => {
    const columns = Object.keys(currentConfig.columnHeaders || {});
    if (columns.length === 0) return;

    const csvRows = displayItems.map((item) => {
      const mapped = tableMapper ? tableMapper(item) : item;
      return columns
        .map((column) => {
          const value = mapped[column] ?? "";
          return `"${String(value).replace(/"/g, '""')}"`;
        })
        .join(",");
    });

    const csv = [columns.join(","), ...csvRows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${Route.toLowerCase()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }, [currentConfig, displayItems, tableMapper, Route]);

  const handleBtnClick = useCallback(
    (btnId: string) => {
      if (btnId === "new-item") {
        setFormMode("add");
        setFormData(buildInitialFormValues());
        setIsModalOpen(true);
      } else if (btnId === "refresh") {
        reload();
      } else if (btnId === "export") {
        handleExport();
      }
    },
    [buildInitialFormValues, reload, handleExport],
  );

  const handleEditItem = useCallback(() => {
    if (!selectedRawRow) return;
    setFormMode("edit");
    setFormData(buildInitialFormValues(selectedRawRow));
    setIsModalOpen(true);
  }, [selectedRawRow, buildInitialFormValues]);

  const handleSelectRow = useCallback(
    (mappedRow: Row) => {
      const raw = items.find(
        (item) => (item._id || item.id) === (mappedRow._id || mappedRow.id),
      );
      setSelectedRawRow(raw || mappedRow);
    },
    [items],
  );

  const handleSaveItem = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      if (!service) return;

      setIsSaving(true);
      setLoadError(null);
      setNotice(null);

      try {
        if (formMode === "add") {
          if (!service.create) {
            throw new Error(`Creating ${Route} is not supported by the API.`);
          }
          const created = await service.create(formData);
          const generated = (created as { temporaryPassword?: string } | null)?.temporaryPassword;
          setNotice(
            generated
              ? `${Route} created. Temporary password: ${generated}`
              : `${Route} created successfully.`,
          );
        } else {
          const id = selectedRawRow?._id || selectedRawRow?.id;
          if (!service.update || !id) {
            throw new Error(`Updating ${Route} is not supported by the API.`);
          }
          const result = await service.update(String(id), formData);
          setNotice(
            Array.isArray(result)
              ? `${Route} updated: ${result.join(", ")}.`
              : `${Route} updated successfully.`,
          );
        }

        setIsModalOpen(false);
        reload();
      } catch (error) {
        setLoadError(extractApiError(error));
      } finally {
        setIsSaving(false);
      }
    },
    [service, formMode, formData, selectedRawRow, Route, reload],
  );

  const handleDeleteItem = useCallback(
    async (id: string) => {
      if (!service?.remove) {
        setLoadError(`Deleting ${Route} is not supported by the API.`);
        return;
      }

      setLoadError(null);
      setNotice(null);
      try {
        await service.remove(id);
        setSelectedRawRow(null);
        setNotice(`${Route} deleted.`);
        reload();
      } catch (error) {
        setLoadError(extractApiError(error));
      }
    },
    [service, Route, reload],
  );

  /**
   * The media modal hands back the picked file alongside its metadata. A file
   * present means "upload"; anything else would be an in-place edit, which the
   * media API does not support.
   */
  const handleMediaSave = useCallback(
    async (mediaData: Row) => {
      setIsSaving(true);
      setLoadError(null);
      setNotice(null);

      try {
        const file = mediaData.file as File | undefined;
        if (!file) {
          throw new Error(
            "Pick a file before saving. Uploaded media cannot be edited in place.",
          );
        }

        await mediaService.upload({ file, altText: mediaData.altText });
        setNotice("Media uploaded.");
        setIsModalOpen(false);
        reload();
      } catch (error) {
        setLoadError(extractApiError(error));
      } finally {
        setIsSaving(false);
      }
    },
    [reload],
  );

  const isBusy = isLoading || isRestoring;
  const isTruncated = Boolean(meta && meta.total > items.length);

  return (
    <div className="flex gap-3 p-3 min-h-screen w-full flex-col text-[var(--text)] bg-[var(--background)] transition-colors duration-200 antialiased lg:h-screen lg:overflow-hidden">
      <header className="flex shrink-0 w-full items-center justify-between">
        <TopBar
          title={Route}
          subtitle={`Manage and organize all your ${Route.toLowerCase()}`}
          user={{
            name: user?.name || "Admin",
            role: user?.role
              ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
              : "Admin",
            avatar: user?.avatar || "",
          }}
          messages={[]}
          notifications={[]}
          searchPlaceholder={`Search ${Route.toLowerCase()}...`}
          searchData={tabFilteredItems as never}
          searchFields={currentConfig.searchFields}
          onSearchResults={(results) => setDisplayItems(results)}
        />
      </header>

      {(loadError || notice || isTruncated) && (
        <div
          className={`shrink-0 flex items-start gap-2 rounded-xl border px-3 py-2 text-xs ${
            loadError
              ? "border-red-500/30 bg-red-500/10 text-red-500"
              : "border-emerald-500/30 bg-emerald-500/10 text-emerald-600"
          }`}
        >
          {loadError ? (
            <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          ) : (
            <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          )}
          <span className="flex-1">
            {loadError ||
              notice ||
              `Showing the first ${items.length} of ${meta?.total} records. Narrow the search to see the rest.`}
          </span>
          <button
            type="button"
            onClick={() => {
              setLoadError(null);
              setNotice(null);
              setMeta(null);
            }}
            className="shrink-0 hover:opacity-70"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="flex flex-1 flex-col min-h-0 w-full overflow-y-auto lg:flex-row lg:overflow-hidden gap-3">
        <section className="flex flex-1 flex-col lg:min-w-158 min-h-0 bg-[var(--background)] space-y-3 lg:overflow-hidden">
          <div className="w-full shrink-0">
            <StatsGrid pageUrl={Route.toLowerCase()} items={items} isLoading={isBusy} />
          </div>

          <div className="flex flex-1 flex-col min-h-100 lg:min-h-0 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-sm lg:overflow-hidden">
            <div className="shrink-0 border-b border-[var(--border)] bg-[var(--surface)] px-4 sm:px-3 pt-3 pb-1 overflow-x-auto rounded-t-xl">
              <TabsBar
                tablist={tablist}
                activeTab={activeTab}
                onTabChange={(tab) => {
                  setActiveTab(tab);
                  setSelectedRawRow(null);
                }}
                btnlist={btnlist}
                onBtnClick={handleBtnClick}
              />
            </div>

            <div className="shrink-0 bg-[var(--surface)] px-3 sm:px-3 pt-3 pb-1">
              <FilterBar
                sourceData={tabFilteredItems as never}
                searchableFieldsKeys={currentConfig.searchFields}
                searchPlaceholder={`Search ${Route.toLowerCase()}...`}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                filtersData={(currentConfig.filters || []) as any}
                onDataChange={setDisplayItems}
              />
            </div>

            <div className="flex-1 min-h-0 border border-[var(--border)] rounded-xl overflow-auto bg-[var(--surface)] mx-3 relative">
              {isBusy && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-[var(--surface)]/70 backdrop-blur-[1px]">
                  <Loader2 className="w-5 h-5 animate-spin text-[var(--primary)]" />
                </div>
              )}
              <CreateTable
                data={formattedTableData}
                selectedItem={
                  selectedRawRow && tableMapper ? tableMapper(selectedRawRow) : null
                }
                onSelectItem={handleSelectRow}
                columnHeaders={currentConfig.columnHeaders}
              />
            </div>

            <div className="shrink-0 rounded-b-xl bg-[var(--surface)] px-3">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                totalItems={displayItems.length}
                onPageChange={(page) => setCurrentPage(page)}
                onItemsPerPageChange={(limit) => {
                  setItemsPerPage(limit);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
        </section>

        <DetailPanel
          selectedItem={selectedDetailData as never}
          panelTitle={`${Route} Details`}
          onClose={() => setSelectedRawRow(null)}
          onEdit={handleEditItem}
          onDelete={(id) => {
            void handleDeleteItem(String(id));
          }}
          editLabel={`Edit ${Route}`}
          deleteLabel={`Delete ${Route}`}
        />
      </div>

      {isMediaPage ? (
        <MediaHandlerModal
          isOpen={isModalOpen}
          mode={formMode}
          initialData={selectedRawRow}
          onClose={() => setIsModalOpen(false)}
          onSave={handleMediaSave}
        />
      ) : (
        <FormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          formMode={formMode}
          itemTypeLabel={Route}
          formData={formData}
          setFormData={setFormData}
          handleSave={handleSaveItem}
          fields={formFields}
          categoryOptions={options.categoryOptions || configOptions.categoryOptions || []}
          brandOptions={options.brandOptions || configOptions.brandOptions || []}
          statusOptions={options.statusOptions || configOptions.statusOptions || []}
          error={loadError}
        />
      )}

      {isSaving && (
        <div className="fixed bottom-4 right-4 z-[60] flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs shadow-lg">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-[var(--primary)]" />
          Saving...
        </div>
      )}
    </div>
  );
};

export default PageLayout;
