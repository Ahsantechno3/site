import { SelectOption, FormField } from "@/c2/models/FormModal";
import { Download, Plus, RefreshCcwDot } from "lucide-react";

export interface ProductReview {
  _id?: string;
  id: number;
  productId: string;
  productName: string;
  customerName: string;
  customerEmail: string;
  rating: number; // 1 to 5
  title?: string;
  comment: string;
  status: "published" | "pending" | "rejected" | string;
  isVerifiedPurchase: boolean;
  createdAt: string;
}

export const reviewConfig = {
  routeTitle: "Reviews",

  // Tabs status wise filter
  tabs: ["All Reviews", "Published", "Pending", "Rejected"],

  // Action Buttons
  buttons: [
    {
      id: "export",
      label: "Export Reviews",
      icon: Download,
      variant: "secondary" as const,
      show: true,
      disabled: false,
    },
    {
      id: "new-item",
      label: "Add Review",
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
  searchFields: ["productName", "customerName", "customerEmail", "comment"],

  // Table Column Labels
  columnHeaders: {
    _id: "ID",
    productName: "Product",
    customerName: "Customer",
    rating: "Rating",
    isVerifiedPurchase: "Verified",
    status: "Status",
  },

  // Dummy Items Data
  items: [
    {
      _id: "66d48f21e8a9f1a23b666001",
      id: 1,
      productId: "66d48f21e8a9f1a23b456789",
      productName: "Wireless Noise-Canceling Headphones",
      customerName: "Ali Raza",
      customerEmail: "ali@example.com",
      rating: 5,
      title: "Amazing Sound Quality!",
      comment: "The active noise cancellation works perfectly during travel.",
      status: "published",
      isVerifiedPurchase: true,
      createdAt: "2026-08-20T10:15:00Z",
    },
    {
      _id: "66d48f21e8a9f1a23b666002",
      id: 2,
      productId: "66d48f21e8a9f1a23b456790",
      productName: "Ergonomic Mesh Chair",
      customerName: "Usman Ahmed",
      customerEmail: "usman@example.com",
      rating: 2,
      title: "Average Quality",
      comment: "Armrests feel a bit wobbly, not worth the full price.",
      status: "pending",
      isVerifiedPurchase: false,
      createdAt: "2026-08-25T14:30:00Z",
    },
  ] as ProductReview[],

  // Map Data for CreateTable Component
  mapTableData: (review: ProductReview) => ({
    id: review._id || String(review.id),
    _id: review._id || String(review.id),
    productName: review.productName,
    customerName: review.customerName,
    rating: `${review.rating} ★`,
    isVerifiedPurchase: review.isVerifiedPurchase ? "Yes" : "No",
    status: review.status,
  }),

  // Map Data for DetailPanel Component
  mapDetailData: (review: ProductReview) => ({
    id: review._id || String(review.id),
    title: review.title || `${review.rating} Star Review`,
    status: review.status,
    shortDescription: `By ${review.customerName} (${review.customerEmail})`,
    attributes: {
      Product: review.productName,
      Rating: `${review.rating} / 5 Stars`,
      "Verified Purchase": review.isVerifiedPurchase ? "Yes" : "No",
      "Customer Email": review.customerEmail,
      "Submitted Date": review.createdAt ? new Date(review.createdAt).toLocaleDateString() : "N/A",
    },
    description: review.comment || "",
  }),

  // Map Data for FormModal (Add/Edit Mode)
  mapFormData: (review?: ProductReview) => {
    if (!review) {
      return {
        productName: "",
        customerName: "",
        customerEmail: "",
        rating: 5,
        status: "published",
        isVerifiedPurchase: true,
        title: "",
        comment: "",
      };
    }

    return {
      _id: review._id,
      id: review.id,
      productName: review.productName || "",
      customerName: review.customerName || "",
      customerEmail: review.customerEmail || "",
      rating: review.rating || 5,
      status: review.status || "published",
      isVerifiedPurchase: Boolean(review.isVerifiedPurchase),
      title: review.title || "",
      comment: review.comment || "",
    };
  },

  // Table Filters
  filters: [
    {
      id: "rating",
      placeholder: "Filter Rating",
      options: [
        { label: "All Ratings", value: "all" },
        { label: "5 Stars", value: "5" },
        { label: "4 Stars", value: "4" },
        { label: "3 Stars", value: "3" },
        { label: "2 Stars & Below", value: "low" },
      ],
    },
  ],

  // Select Options for FormModal Dynamic Dropdowns
  categoryOptions: [
    { label: "5 Stars (Excellent)", value: "5" },
    { label: "4 Stars (Very Good)", value: "4" },
    { label: "3 Stars (Average)", value: "3" },
    { label: "2 Stars (Poor)", value: "2" },
    { label: "1 Star (Terrible)", value: "1" },
  ] as SelectOption[],

  brandOptions: [
    { label: "Verified Buyer", value: "verified" },
    { label: "Unverified Buyer", value: "unverified" },
  ] as SelectOption[],

  statusOptions: [
    { label: "Published", value: "published" },
    { label: "Pending Approval", value: "pending" },
    { label: "Rejected", value: "rejected" },
  ] as SelectOption[],

  // Dynamic FormModal Schema Definition
  formFields: [
    // Section 1: Customer & Product
    {
      name: "productName",
      label: "Product Name",
      type: "text",
      required: true,
      colSpan: 2,
      placeholder: "e.g. Wireless Noise-Canceling Headphones",
      section: "Review Overview",
    },
    {
      name: "customerName",
      label: "Customer Name",
      type: "text",
      required: true,
      colSpan: 2,
      placeholder: "e.g. Emily Watson",
      section: "Review Overview",
    },
    {
      name: "customerEmail",
      label: "Customer Email",
      type: "text",
      required: true,
      colSpan: 2,
      placeholder: "e.g. emily@example.com",
      section: "Review Overview",
    },
    {
      name: "rating",
      label: "Star Rating",
      type: "select",
      required: true,
      colSpan: 1,
      options: [
        { label: "5 Stars (Excellent)", value: "5" },
        { label: "4 Stars (Very Good)", value: "4" },
        { label: "3 Stars (Average)", value: "3" },
        { label: "2 Stars (Poor)", value: "2" },
        { label: "1 Star (Terrible)", value: "1" },
      ],
      section: "Review Overview",
    },
    {
      name: "status",
      label: "Moderation Status",
      type: "select",
      required: true,
      colSpan: 1,
      options: [
        { label: "Published", value: "published" },
        { label: "Pending Approval", value: "pending" },
        { label: "Rejected", value: "rejected" },
      ],
      section: "Review Overview",
    },
    {
      name: "isVerifiedPurchase",
      label: "Verified Buyer Purchase",
      type: "switch",
      colSpan: 2,
      section: "Review Overview",
    },

    // Section 2: Review Content
    {
      name: "title",
      label: "Review Headline / Title",
      type: "text",
      colSpan: 4,
      placeholder: "e.g. Outstanding battery life and great build quality!",
      section: "Review Feedback",
    },
    {
      name: "comment",
      label: "Customer Feedback & Comments",
      type: "textarea",
      required: true,
      rows: 4,
      colSpan: 4,
      placeholder: "Write the full customer review...",
      section: "Review Feedback",
    },
  ] as FormField[],
};