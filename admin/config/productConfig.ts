import { SelectOption, FormField } from "@/components/models/FormModal";
import { Download, Plus, RefreshCcwDot } from "lucide-react";

export interface ProductSpecification {
  key: string;
  value: string;
}

export interface Product {
  _id?: string;
  id: number;
  name: string;
  sku: string;
  category: string | { _id?: string; name?: string };
  brand: string | { _id?: string; name?: string };
  status: "published" | "draft" | "archived";
  image?: string;
  gallery?: string[];
  price: number;
  salePrice: number;
  discount?: number;
  rating?: number;
  reviewsCount?: number;
  stock: number;
  lowStockThreshold: number;
  weight?: number;
  dimensions?: string;
  featured?: boolean;
  createdAt?: string;
  shortDescription?: string;
  description?: string;
  tags?: string[];
  specifications?: ProductSpecification[];
}

const referenceId = (reference: Product["category"]): string =>
  typeof reference === "string" ? reference : reference?._id || "";

const referenceName = (reference: Product["category"]): string =>
  typeof reference === "string" ? reference : reference?.name || "";

export const productConfig = {
  routeTitle: "Products",

  // Tabs status wise filter — these map 1:1 onto Product.status in the API
  // ("Pending Review" is normalised to "pending_review" before comparison).
  tabs: ["All Products", "Published", "Pending Review", "Draft", "Rejected", "Archived"],

  // Action Buttons
  buttons: [
    {
      id: "export",
      label: "Export Products",
      icon: Download,
      variant: "secondary" as const,
      show: true,
      disabled: false,
    },
    {
      id: "new-item",
      label: "Add Product",
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

  // Search Parameters
  searchFields: ["name", "sku", "category", "brand"],

  // Table Column Labels
  columnHeaders: {
    _id: "ID",
    name: "Product Name",
    sku: "SKU",
    category: "Category",
    price: "Price",
    stock: "Stock",
    status: "Status",
  },

  // Dummy Items Data (5 Real Items)
  items: [
    {
      _id: "66d48f21e8a9f1a23b456789",
      id: 101,
      name: "Wireless Noise-Canceling Headphones",
      sku: "HD-PRO-100",
      category: "Electronics",
      brand: "AudioTech",
      status: "published",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60",
      gallery: [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&auto=format&fit=crop&q=60",
      ],
      price: 299.99,
      salePrice: 249.99,
      discount: 16,
      rating: 4.8,
      reviewsCount: 124,
      stock: 45,
      lowStockThreshold: 10,
      weight: 0.35,
      dimensions: "20 x 18 x 8 cm",
      featured: true,
      createdAt: "2026-08-10T08:00:00Z",
      shortDescription:
        "High-quality wireless headphones with active noise cancellation.",
      description:
        "Experience premium sound quality with ultra-soft earcups and long battery life.",
      tags: ["wireless", "audio", "bluetooth"],
      specifications: [
        { key: "Connectivity", value: "Bluetooth 5.2" },
        { key: "Battery Life", value: "30 Hours" },
      ],
    },
    {
      _id: "66d48f21e8a9f1a23b456790",
      id: 102,
      name: "Ergonomic Mesh Chair",
      sku: "CH-ERG-202",
      category: "Furniture",
      brand: "ComfortMax",
      status: "draft",
      image: "https://images.unsplash.com/photo-1580481072645-022f9a6d83d0?w=500&auto=format&fit=crop&q=60",
      gallery: [
        "https://images.unsplash.com/photo-1580481072645-022f9a6d83d0?w=500&auto=format&fit=crop&q=60",
      ],
      price: 180.0,
      salePrice: 180.0,
      discount: 0,
      rating: 4.2,
      reviewsCount: 18,
      stock: 5,
      lowStockThreshold: 8,
      weight: 12.5,
      dimensions: "65 x 65 x 110 cm",
      featured: false,
      createdAt: "2026-08-15T09:30:00Z",
      shortDescription: "Breathable mesh back office chair.",
      description: "Designed for posture support during long working hours.",
      tags: ["chair", "office", "ergonomic"],
      specifications: [
        { key: "Material", value: "Mesh & Steel" },
        { key: "Weight Capacity", value: "150 kg" },
      ],
    },
    {
      _id: "66d48f21e8a9f1a23b456791",
      id: 103,
      name: "Smart Watch Series 7",
      sku: "SW-SER-700",
      category: "Electronics",
      brand: "AudioTech",
      status: "published",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60",
      gallery: [
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60",
      ],
      price: 199.99,
      salePrice: 169.99,
      discount: 15,
      rating: 4.6,
      reviewsCount: 89,
      stock: 22,
      lowStockThreshold: 5,
      weight: 0.15,
      dimensions: "4.4 x 3.8 x 1.0 cm",
      featured: true,
      createdAt: "2026-08-18T10:15:00Z",
      shortDescription: "Fitness and health tracking smartwatch.",
      description:
        "Track your workouts, heart rate, and notifications seamlessly.",
      tags: ["smartwatch", "fitness", "gadgets"],
      specifications: [
        { key: "Display", value: "1.9 inch AMOLED" },
        { key: "Water Resistance", value: "50m" },
      ],
    },
    {
      _id: "66d48f21e8a9f1a23b456792",
      id: 104,
      name: "Minimalist Leather Backpack",
      sku: "BP-LEA-404",
      category: "Clothing",
      brand: "Generic",
      status: "published",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=60",
      gallery: [
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=60",
      ],
      price: 120.0,
      salePrice: 99.0,
      discount: 17,
      rating: 4.5,
      reviewsCount: 42,
      stock: 14,
      lowStockThreshold: 3,
      weight: 0.85,
      dimensions: "40 x 30 x 15 cm",
      featured: false,
      createdAt: "2026-08-20T14:20:00Z",
      shortDescription: "Premium genuine leather laptop backpack.",
      description:
        "Durable, stylish, and perfect for daily commute or weekend trips.",
      tags: ["backpack", "leather", "travel"],
      specifications: [
        { key: "Laptop Size", value: "Up to 15.6 inch" },
        { key: "Material", value: "100% Genuine Leather" },
      ],
    },
    {
      _id: "66d48f21e8a9f1a23b456793",
      id: 105,
      name: "Mechanical Gaming Keyboard",
      sku: "KB-MCH-505",
      category: "Electronics",
      brand: "AudioTech",
      status: "archived",
      image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=60",
      gallery: [
        "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=60",
      ],
      price: 89.99,
      salePrice: 79.99,
      discount: 11,
      rating: 4.7,
      reviewsCount: 210,
      stock: 0,
      lowStockThreshold: 5,
      weight: 0.95,
      dimensions: "44 x 13 x 3.5 cm",
      featured: false,
      createdAt: "2026-08-22T11:00:00Z",
      shortDescription: "RGB backlit mechanical keyboard with tactile switches.",
      description: "Ultra-fast response time designed for gaming enthusiasts.",
      tags: ["keyboard", "gaming", "rgb"],
      specifications: [
        { key: "Switch Type", value: "Mechanical Red" },
        { key: "Lighting", value: "Customizable RGB" },
      ],
    },
  ] as Product[],

  // Map Data for CreateTable Component
  mapTableData: (product: Product) => ({
    id: product._id || product.id,
    _id: product._id || String(product.id),
    name: product.name,
    image: product.image,
    sku: product.sku,
    category: referenceName(product.category),
    price: `$${product.price?.toFixed(2) || "0.00"}`,
    stock: product.stock,
    status: product.status,
  }),

  // Map Data for DetailPanel Component
  mapDetailData: (product: Product) => ({
    id: product._id || String(product.id),
    title: product.name,
    status: product.status,
    image: product.image,
    shortDescription: product.shortDescription || `SKU: ${product.sku}`,
    attributes: {
      SKU: product.sku,
      Category: referenceName(product.category),
      Brand: referenceName(product.brand),
      Price: `$${product.price?.toFixed(2) || "0.00"}`,
      SalePrice: `$${product.salePrice?.toFixed(2) || "0.00"}`,
      Discount: product.discount ? `${product.discount}%` : "0%",
      Stock: product.stock,
      LowStockThreshold: product.lowStockThreshold,
      Rating: product.rating
        ? `${product.rating} ★ (${product.reviewsCount || 0})`
        : "N/A",
      Featured: product.featured ? "Yes" : "No",
      Weight: product.weight ? `${product.weight} kg` : "N/A",
      Dimensions: product.dimensions || "N/A",
    },
    description: product.description || "",
    tags: product.tags || [],
    specifications: product.specifications || [],
  }),

  // Map Data for FormModal (Add/Edit Mode)
  mapFormData: (product?: Product) => {
    if (!product) {
      return {
        name: "",
        sku: "",
        category: "",
        brand: "",
        status: "published",
        price: 0,
        salePrice: 0,
        discount: 0,
        stock: 0,
        lowStockThreshold: 5,
        weight: 0,
        dimensions: "",
        featured: false,
        shortDescription: "",
        description: "",
        tags: [],
        specifications: [],
      };
    }

    return {
      name: product.name || "",
      sku: product.sku || "",
      category: referenceId(product.category),
      brand: referenceId(product.brand),
      status: product.status || "published",
      price: product.price || 0,
      salePrice: product.salePrice || 0,
      discount: product.discount || 0,
      stock: product.stock || 0,
      lowStockThreshold: product.lowStockThreshold || 5,
      weight: product.weight || 0,
      dimensions: product.dimensions || "",
      featured: product.featured || false,
      shortDescription: product.shortDescription || "",
      description: product.description || "",
      tags: product.tags || [],
      specifications: product.specifications || [],
    };
  },

  // Table Filters
  filters: [
    {
      id: "category",
      placeholder: "All Categories",
      options: [
        { label: "All Categories", value: "all" },
        { label: "Electronics", value: "Electronics" },
        { label: "Furniture", value: "Furniture" },
        { label: "Clothing", value: "Clothing" },
      ],
    },
  ],

  // FormModal Dropdown Options
  statusOptions: [
    { label: "Published", value: "published" },
    { label: "Pending Review", value: "pending_review" },
    { label: "Draft", value: "draft" },
    { label: "Rejected", value: "rejected" },
    { label: "Archived", value: "archived" },
  ] as SelectOption[],

  // Dynamic FormModal Schema Definition
  formFields: [
    // Section 1: Basic Information
    {
      name: "name",
      label: "Product Name",
      type: "text",
      required: true,
      colSpan: 2,
      placeholder: "e.g. Wireless Noise-Canceling Headphones",
      section: "Basic Information",
    },
    {
      name: "sku",
      label: "SKU / Code",
      type: "text",
      required: true,
      colSpan: 1,
      placeholder: "e.g. HD-PRO-100",
      section: "Basic Information",
    },
    {
      name: "category",
      label: "Category",
      type: "select",
      required: true,
      colSpan: 1,
      section: "Basic Information",
    },
    {
      name: "brand",
      label: "Brand",
      type: "select",
      required: true,
      colSpan: 1,
      section: "Basic Information",
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      required: true,
      colSpan: 1,
      options: [
        { label: "Published", value: "published" },
        { label: "Pending Review", value: "pending_review" },
        { label: "Draft", value: "draft" },
        { label: "Rejected", value: "rejected" },
        { label: "Archived", value: "archived" },
      ],
      section: "Basic Information",
    },
    {
      name: "featured",
      label: "Featured Product",
      type: "switch",
      colSpan: 2,
      section: "Basic Information",
    },

    // Section 2: Pricing & Inventory
    {
      name: "price",
      label: "Cost Price ($)",
      type: "number",
      min: 0,
      colSpan: 1,
      section: "Pricing & Inventory",
    },
    {
      name: "salePrice",
      label: "Sale Price ($)",
      type: "number",
      required: true,
      min: 0,
      colSpan: 1,
      section: "Pricing & Inventory",
    },
    {
      name: "discount",
      label: "Discount (%)",
      type: "number",
      min: 0,
      max: 100,
      colSpan: 1,
      section: "Pricing & Inventory",
    },
    {
      name: "stock",
      label: "Stock Quantity",
      type: "number",
      required: true,
      min: 0,
      colSpan: 1,
      section: "Pricing & Inventory",
    },
    {
      name: "lowStockThreshold",
      label: "Low Stock Alert",
      type: "number",
      min: 0,
      colSpan: 1,
      section: "Pricing & Inventory",
    },
    {
      name: "weight",
      label: "Weight (kg)",
      type: "number",
      step: 0.01,
      min: 0,
      colSpan: 1,
      section: "Pricing & Inventory",
    },
    {
      name: "dimensions",
      label: "Dimensions (L x W x H)",
      type: "text",
      colSpan: 2,
      placeholder: "e.g. 20 x 15 x 8 cm",
      section: "Pricing & Inventory",
    },

    // Section 3: Tags & Specifications
    {
      name: "tags",
      label: "Product Tags",
      type: "tags",
      colSpan: 2,
      placeholder: "Type and press Enter...",
      section: "Tags & Specifications",
    },
    {
      name: "specifications",
      label: "Dynamic Specifications",
      type: "key-value",
      colSpan: 2,
      section: "Tags & Specifications",
    },

    // Section 4: Media & Descriptions
    {
      name: "image",
      label: "Product Primary Image URL",
      type: "image",
      colSpan: 2,
      section: "Media & Descriptions",
    },
    {
      name: "shortDescription",
      label: "Short Summary",
      type: "textarea",
      rows: 2,
      colSpan: 2,
      section: "Media & Descriptions",
    },
    {
      name: "description",
      label: "Full Description",
      type: "textarea",
      rows: 4,
      colSpan: 4,
      section: "Media & Descriptions",
    },
  ] as FormField[],
};
