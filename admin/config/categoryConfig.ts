import { SelectOption, FormField } from "@/components/models/FormModal";
import { Download, Plus, RefreshCcwDot } from "lucide-react";

export interface Category {
  _id?: string;
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  image?: string;
  parentCategory?: string | null;
  productsCount: number;
  status: "active" | "inactive" | string;
  isFeatured?: boolean;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export const categoryConfig = {
  routeTitle: "Categories",

  // Tabs status wise filter
  tabs: ["All Categories", "Active", "Inactive"],

  // Header Action Buttons
  buttons: [
    {
      id: "export",
      label: "Export Categories",
      icon: Download,
      variant: "secondary" as const,
      show: true,
      disabled: false,
    },
    {
      id: "new-item",
      label: "Add Category",
      icon: Plus,
      variant: "primary" as const,
      show: true,
      disabled: false,
    },
    {
      id: "refresh",
      label: "Refresh Data",
      icon: RefreshCcwDot,
      variant: "primary" as const,
      show: true,
      disabled: false,
    },
  ],

  // Search Fields
  searchFields: ["name", "slug", "description"],

  // Table Column Labels
  columnHeaders: {
    _id: "ID",
    name: "Category Name",
    slug: "Slug",
    productsCount: "Total Products",
    isFeatured: "Featured",
    status: "Status",
  },

  // Dummy Categories List
  items: [
    {
      _id: "cat_66d48f21e8a9f1a23b888001",
      id: 1,
      name: "Electronics",
      slug: "electronics",
      description: "Gadgets, devices, audio accessories, and home appliances.",
      icon: "Laptop",
      image: "https://via.placeholder.com/150",
      parentCategory: null,
      productsCount: 142,
      status: "active",
      isFeatured: true,
      sortOrder: 1,
      createdAt: "2026-08-01T10:00:00Z",
      updatedAt: "2026-08-20T12:00:00Z",
    },
    {
      _id: "cat_66d48f21e8a9f1a23b888002",
      id: 2,
      name: "Furniture",
      slug: "furniture",
      description: "Ergonomic office chairs, tables, and home furniture items.",
      icon: "Armchair",
      image: "https://via.placeholder.com/150",
      parentCategory: null,
      productsCount: 38,
      status: "active",
      isFeatured: false,
      sortOrder: 2,
      createdAt: "2026-08-05T09:30:00Z",
      updatedAt: "2026-08-25T14:15:00Z",
    },
  ] as Category[],

  // Map Data for CreateTable Component
  mapTableData: (category: Category) => ({
    id: category._id || String(category.id),
    _id: category.slug,
    name: category.name,
    slug: `/${category.slug}`,
    productsCount: category.productsCount,
    isFeatured: category.isFeatured ? "Yes" : "No",
    status: category.status,
  }),

  // Map Data for DetailPanel Component
  mapDetailData: (category: Category) => ({
    id: category._id || String(category.id),
    title: category.name,
    status: category.status,
    image: category.image,
    shortDescription: category.description || `Slug: ${category.slug}`,
    attributes: {
      Slug: category.slug,
      "Total Products": category.productsCount,
      "Parent Category": category.parentCategory || "None (Main)",
      Featured: category.isFeatured ? "Yes" : "No",
      "Sort Order": category.sortOrder ?? "N/A",
      "Created Date": category.createdAt ? new Date(category.createdAt).toLocaleDateString() : "N/A",
    },
    description: category.description || "",
  }),

  // Map Data for FormModal (Add/Edit Mode)
  mapFormData: (category?: Category) => {
    if (!category) {
      return {
        name: "",
        slug: "",
        parentCategory: "main",
        description: "",
        icon: "",
        image: "",
        banner: "",
        status: "active",
        isFeatured: false,
        sortOrder: 0,
      };
    }

    return {
      _id: category._id,
      id: category.id,
      name: category.name || "",
      slug: category.slug || "",
      parentCategory: category.parentCategory || "main",
      description: category.description || "",
      icon: category.icon || "",
      image: category.image || "",
      banner: (category as any).banner || "",
      status: category.status || "active",
      isFeatured: category.isFeatured || false,
      sortOrder: category.sortOrder ?? 0,
    };
  },

  // Table Filters
  filters: [
    {
      id: "isFeatured",
      placeholder: "Featured Status",
      options: [
        { label: "All Types", value: "all" },
        { label: "Featured", value: "true" },
        { label: "Standard", value: "false" },
      ],
    },
  ],

  // Select Options for FormModal Dynamic Dropdowns
  categoryOptions: [
    { label: "Main Category (None)", value: "main" },
    { label: "Electronics", value: "electronics" },
    { label: "Furniture", value: "furniture" },
  ] as SelectOption[],

  brandOptions: [
    { label: "Standard Category", value: "standard" },
    { label: "Featured Category", value: "featured" },
  ] as SelectOption[],

  statusOptions: [
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
  ] as SelectOption[],

  // Dynamic FormModal Schema Definition
  formFields: [
    // Section 1: Category Details
    {
      name: "name",
      label: "Category Name",
      type: "text",
      required: true,
      colSpan: 2,
      placeholder: "e.g. Electronics",
      section: "Category Details",
    },
    {
      name: "slug",
      label: "Slug (URL identifier)",
      type: "text",
      required: true,
      colSpan: 2,
      placeholder: "e.g. electronics",
      section: "Category Details",
    },
    {
      name: "parentCategory",
      label: "Parent Category",
      type: "select",
      colSpan: 2,
      options: [
        { label: "Main Category (None)", value: "main" },
        { label: "Electronics", value: "electronics" },
        { label: "Furniture", value: "furniture" },
      ],
      section: "Category Details",
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      required: true,
      colSpan: 1,
      options: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
      ],
      section: "Category Details",
    },
    {
      name: "sortOrder",
      label: "Sort Order",
      type: "number",
      min: 0,
      colSpan: 1,
      section: "Category Details",
    },
    {
      name: "isFeatured",
      label: "Featured Category (Show on Homepage)",
      type: "switch",
      colSpan: 2,
      section: "Category Details",
    },

    // Section 2: Visual Assets
    {
      name: "icon",
      label: "Menu Icon URL / SVG",
      type: "text",
      colSpan: 2,
      placeholder: "e.g. /icons/electronics.svg",
      section: "Visual Assets & Icons",
    },
    {
      name: "image",
      label: "Card Thumbnail URL",
      type: "image",
      colSpan: 2,
      placeholder: "https://...",
      section: "Visual Assets & Icons",
    },
    {
      name: "banner",
      label: "Category Hero Banner URL",
      type: "image",
      colSpan: 4,
      placeholder: "https://...",
      section: "Visual Assets & Icons",
    },

    // Section 3: Description
    {
      name: "description",
      label: "Category Description",
      type: "textarea",
      rows: 3,
      colSpan: 4,
      placeholder: "Describe this category...",
      section: "Description & SEO",
    },
  ] as FormField[],
};