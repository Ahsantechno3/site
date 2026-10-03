import { SelectOption } from "@/components/ui/Select";
import { Download, Plus, RefreshCcwDot } from "lucide-react";

export interface MediaItem {
  _id?: string;
  id: number;
  name: string;
  url: string;
  image: string;
  type: string;
  mimeType: string;
  extension: string;
  size: string;
  dimensions?: string;
  altText?: string;
  category: string;
  status: "published" | "draft" | "archived";
  createdAt?: string;
}

export const mediaConfig = {
  routeTitle: "Media",

  tabs: ["All Media", "Published", "Draft", "Archived"],

  buttons: [
    {
      id: "export",
      label: "Export Media",
      icon: Download,
      variant: "secondary" as const,
      show: true,
      disabled: false,
    },
    {
      id: "new-item",
      label: "Upload Media",
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

  searchFields: ["name", "category", "type", "extension", "altText"],

  // 1. Image column added BEFORE ID
  columnHeaders: {
    image: "Image",
    _id: "ID",
    name: "File Name",
    category: "Category",
    type: "Type",
    size: "Size",
    status: "Status",
  },

  items: [
    {
      _id: "66d48f21e8a9f1a23b456791",
      id: 201,
      name: "hero-banner-summer.png",
      url: "https://via.placeholder.com/800x400",
      type: "image",
      mimeType: "image/png",
      extension: "png",
      size: "1.2 MB",
      dimensions: "1920x1080",
      altText: "Summer Sale Promo Banner",
      category: "Banners",
      status: "published",
      createdAt: "2026-08-20T10:00:00Z",
    },
    {
      _id: "66d48f21e8a9f1a23b456792",
      id: 202,
      name: "headphone-spec-sheet.pdf",
      url: "https://via.placeholder.com/150",
      type: "document",
      mimeType: "application/pdf",
      extension: "pdf",
      size: "850 KB",
      dimensions: "A4",
      altText: "AudioTech Headphone Specifications",
      category: "Documents",
      status: "draft",
      createdAt: "2026-08-22T14:30:00Z",
    },
  ] as MediaItem[],

  // 2. Map image URL in Table Data
  mapTableData: (media: MediaItem) => ({
    image: media.url || media.image || "",
    id: media._id || media.id,
    _id: media._id || String(media.id),
    name: media.name,
    category: media.category,
    type: media.type,
    size: media.size,
    status: media.status,
  }),

  mapDetailData: (media: MediaItem) => ({
    id: media._id || String(media.id),
    title: media.name,
    status: media.status,
    image: media.type === "image" ? media.url : undefined,
    shortDescription: `Category: ${media.category} • ${media.size}`,
    attributes: {
      "File Name": media.name,
      URL: media.url,
      Category: media.category,
      Type: media.type,
      "MIME Type": media.mimeType,
      Extension: media.extension,
      Size: media.size,
      Dimensions: media.dimensions || "N/A",
      "Alt Text": media.altText || "N/A",
    },
    description: media.altText || "",
    tags: [media.type, media.extension, media.category.toLowerCase()],
    specifications: [
      { key: "Format", value: media.extension.toUpperCase() },
      { key: "Dimensions", value: media.dimensions || "N/A" },
    ],
  }),

  mapFormData: (media?: MediaItem) => {
    if (!media) {
      return {
        name: "",
        url: "",
        category: "Products",
        brand: "image",
        status: "published",
        altText: "",
        size: "0 KB",
        dimensions: "",
        extension: "png",
      };
    }

    return {
      name: media.name || "",
      url: media.url || "",
      category: media.category || "Products",
      brand: media.type || "image",
      status: media.status || "published",
      altText: media.altText || "",
      size: media.size || "0 KB",
      dimensions: media.dimensions || "",
      extension: media.extension || "png",
    };
  },

  filters: [
    {
      id: "category",
      placeholder: "All Categories",
      options: [
        { label: "All Categories", value: "all" },
        { label: "Products", value: "Products" },
        { label: "Banners", value: "Banners" },
        { label: "Documents", value: "Documents" },
      ],
    },
  ],

  categoryOptions: [
    { label: "Products", value: "Products" },
    { label: "Banners", value: "Banners" },
    { label: "Documents", value: "Documents" },
    { label: "Logos", value: "Logos" },
  ] as SelectOption[],

  brandOptions: [
    { label: "Image", value: "image" },
    { label: "Video", value: "video" },
    { label: "Document", value: "document" },
  ] as SelectOption[],

  statusOptions: [
    { label: "Published", value: "published" },
    { label: "Draft", value: "draft" },
    { label: "Archived", value: "archived" },
  ] as SelectOption[],
};