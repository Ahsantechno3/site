import { SelectOption, FormField } from "@/components/models/FormModal";
import { Download, Plus, RefreshCcwDot } from "lucide-react";

export interface Brand {
  _id?: string;
  id: number;
  name: string;
  slug: string;
  logo?: string;
  banner?: string;
  description?: string;
  website?: string;
  productsCount?: number;
  isFeatured?: boolean;
  status: "active" | "inactive" | string;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export const brandConfig = {
  routeTitle: "Brands",

  tabs: ["All Brands", "Active", "Inactive"],

  buttons: [
    {
      id: "export",
      label: "Export Brands",
      icon: Download,
      variant: "secondary" as const,
      show: true,
      disabled: false,
    },
    {
      id: "new-item",
      label: "Add Brand",
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

  searchFields: ["name", "slug", "description", "website"],

  columnHeaders: {
    _id: "ID",
    name: "Brand Name",
    slug: "Slug",
    productsCount: "Total Products",
    isFeatured: "Featured",
    status: "Status",
  },

  items: [
    {
      _id: "66d48f21e8a9f1a23b888001",
      id: 1,
      name: "AudioTech",
      slug: "audiotech",
      logo: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=100&auto=format&fit=crop&q=60",
      banner: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&auto=format&fit=crop&q=60",
      description: "Premium acoustics and cutting-edge audio engineering.",
      website: "https://audiotech.example.com",
      productsCount: 42,
      isFeatured: true,
      status: "active",
      sortOrder: 1,
      createdAt: "2026-08-01T10:00:00Z",
    },
    {
      _id: "66d48f21e8a9f1a23b888002",
      id: 2,
      name: "ComfortMax",
      slug: "comfortmax",
      logo: "https://images.unsplash.com/photo-1580481072645-022f9a6d83d0?w=100&auto=format&fit=crop&q=60",
      banner: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&auto=format&fit=crop&q=60",
      description: "Ergonomic workspace furniture designed for posture and productivity.",
      website: "https://comfortmax.example.com",
      productsCount: 18,
      isFeatured: true,
      status: "active",
      sortOrder: 2,
      createdAt: "2026-08-05T12:00:00Z",
    },
    {
      _id: "66d48f21e8a9f1a23b888003",
      id: 3,
      name: "Generic Essentials",
      slug: "generic-essentials",
      logo: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&auto=format&fit=crop&q=60",
      description: "Everyday durable essentials at wholesale prices.",
      website: "https://generic.example.com",
      productsCount: 65,
      isFeatured: false,
      status: "active",
      sortOrder: 3,
      createdAt: "2026-08-10T09:00:00Z",
    },
    {
      _id: "66d48f21e8a9f1a23b888004",
      id: 4,
      name: "VoltGadgets",
      slug: "voltgadgets",
      description: "Smart electronics, power banks and charging solutions.",
      website: "https://voltgadgets.example.com",
      productsCount: 0,
      isFeatured: false,
      status: "inactive",
      sortOrder: 4,
      createdAt: "2026-08-20T16:00:00Z",
    },
  ] as Brand[],

  mapTableData: (brand: Brand) => ({
    id: brand._id || String(brand.id),
    _id: brand.slug,
    name: brand.name,
    slug: `/${brand.slug}`,
    productsCount: brand.productsCount || 0,
    isFeatured: brand.isFeatured ? "Yes" : "No",
    status: brand.status,
  }),

  mapDetailData: (brand: Brand) => ({
    id: brand._id || String(brand.id),
    title: brand.name,
    status: brand.status,
    image: brand.logo,
    shortDescription: brand.description || `Website: ${brand.website || "N/A"}`,
    attributes: {
      Slug: brand.slug,
      Website: brand.website || "N/A",
      "Total Products": brand.productsCount || 0,
      Featured: brand.isFeatured ? "Yes" : "No",
      "Sort Order": brand.sortOrder ?? "N/A",
      "Created Date": brand.createdAt ? new Date(brand.createdAt).toLocaleDateString() : "N/A",
    },
    description: brand.description || "",
  }),

  mapFormData: (brand?: Brand) => {
    if (!brand) {
      return {
        name: "",
        slug: "",
        website: "",
        logo: "",
        banner: "",
        status: "active",
        isFeatured: false,
        sortOrder: 0,
        description: "",
      };
    }

    return {
      _id: brand._id,
      id: brand.id,
      name: brand.name || "",
      slug: brand.slug || "",
      website: brand.website || "",
      logo: brand.logo || "",
      banner: brand.banner || "",
      status: brand.status || "active",
      isFeatured: Boolean(brand.isFeatured),
      sortOrder: brand.sortOrder ?? 0,
      description: brand.description || "",
    };
  },

  filters: [
    {
      id: "isFeatured",
      placeholder: "Featured Status",
      options: [
        { label: "All Brands", value: "all" },
        { label: "Featured Brands", value: "true" },
        { label: "Standard Brands", value: "false" },
      ],
    },
  ],

  categoryOptions: [] as SelectOption[],
  brandOptions: [] as SelectOption[],
  statusOptions: [
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
  ] as SelectOption[],

  // Dynamic FormModal    Schema Definition
  formFields: [
    // Section 1: Brand Details
    {
      name: "name",
      label: "Brand Name",
      type: "text",
      required: true,
      colSpan: 2,
      placeholder: "e.g. AudioTech",
      section: "Brand Details",
    },
    {
      name: "slug",
      label: "Brand Slug (URL Key)",
      type: "text",
      required: true,
      colSpan: 2,
      placeholder: "e.g. audiotech",
      section: "Brand Details",
    },
    {
      name: "website",
      label: "Official Website URL",
      type: "text",
      colSpan: 2,
      placeholder: "https://...",
      section: "Brand Details",
    },
    {
      name: "status",
      label: "Brand Status",
      type: "select",
      required: true,
      colSpan: 1,
      options: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
      ],
      section: "Brand Details",
    },
    {
      name: "sortOrder",
      label: "Sort Order",
      type: "number",
      min: 0,
      colSpan: 1,
      section: "Brand Details",
    },
    {
      name: "isFeatured",
      label: "Featured Brand (Show on Homepage Slider)",
      type: "switch",
      colSpan: 2,
      section: "Brand Details",
    },

    // Section 2: Visual Assets
    {
      name: "logo",
      label: "Brand Square Logo URL",
      type: "image",
      colSpan: 2,
      placeholder: "https://...",
      section: "Visual Assets & Banners",
    },
    {
      name: "banner",
      label: "Brand Storefront Cover Banner URL",
      type: "image",
      colSpan: 4,
      placeholder: "https://...",
      section: "Visual Assets & Banners",
    },

    // Section 3: Description
    {
      name: "description",
      label: "Brand Story & Description",
      type: "textarea",
      rows: 3,
      colSpan: 4,
      placeholder: "Write brand story, warranty policies or description...",
      section: "Description",
    },
  ] as FormField[],
};
