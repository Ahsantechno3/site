import { SelectOption, FormField } from "@/components/models/FormModal";
import { Download, Plus, RefreshCcwDot } from "lucide-react";

export interface ProductReview {
  _id?: string;
  id?: number;
  product?: string | { _id?: string; name?: string };
  user?: string | { _id?: string; firstName?: string; lastName?: string; username?: string; email?: string };
  productId?: string;
  productName?: string;
  customerName?: string;
  customerEmail?: string;
  rating: number; // 1 to 5
  title: string;
  content?: string;
  comment?: string;
  status: "approved" | "pending" | "rejected" | string;
  createdAt?: string;
}

type ReviewReference = ProductReview["product"] | ProductReview["user"];

const referenceId = (reference: ReviewReference): string =>
  typeof reference === "string" ? reference : reference?._id || "";

const referenceLabel = (reference: ReviewReference): string => {
  if (!reference || typeof reference === "string") return "";
  if ("name" in reference && reference.name) return reference.name;
  return ["firstName" in reference ? reference.firstName : "", "lastName" in reference ? reference.lastName : ""]
    .filter(Boolean)
    .join(" ") || ("username" in reference ? reference.username : "") || ("email" in reference ? reference.email : "") || "";
};

export const reviewConfig = {
  routeTitle: "Reviews",

  // Tabs status wise filter
  tabs: ["All Reviews", "Approved", "Pending", "Rejected"],

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
  searchFields: ["title", "content"],

  // Table Column Labels
  columnHeaders: {
    _id: "ID",
    productName: "Product",
    customerName: "Customer",
    rating: "Rating",
    content: "Review",
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
      status: "approved",
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
      createdAt: "2026-08-25T14:30:00Z",
    },
  ] as ProductReview[],

  // Map Data for CreateTable Component
  mapTableData: (review: ProductReview) => ({
    id: review._id || String(review.id),
    _id: review._id || String(review.id),
    productName: referenceLabel(review.product) || review.productName || "",
    customerName: referenceLabel(review.user) || review.customerName || "",
    rating: `${review.rating} ★`,
    content: review.content || review.comment || "",
    status: review.status,
  }),

  // Map Data for DetailPanel Component
  mapDetailData: (review: ProductReview) => ({
    id: review._id || String(review.id),
    title: review.title || `${review.rating} Star Review`,
    status: review.status,
    shortDescription: `By ${referenceLabel(review.user) || review.customerName || "Unknown customer"}`,
    attributes: {
      Product: referenceLabel(review.product) || review.productName || "Unknown product",
      Rating: `${review.rating} / 5 Stars`,
      "Submitted Date": review.createdAt ? new Date(review.createdAt).toLocaleDateString() : "N/A",
    },
    description: review.content || review.comment || "",
  }),

  // Map Data for FormModal (Add/Edit Mode)
  mapFormData: (review?: ProductReview) => {
    if (!review) {
      return {
        product: "",
        user: "",
        rating: 5,
        status: "pending",
        title: "",
        content: "",
      };
    }

    return {
      _id: review._id,
      id: review.id,
      product: referenceId(review.product),
      user: referenceId(review.user),
      rating: review.rating || 5,
      status: review.status || "pending",
      title: review.title || "",
      content: review.content || review.comment || "",
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

  statusOptions: [
    { label: "Approved", value: "approved" },
    { label: "Pending Approval", value: "pending" },
    { label: "Rejected", value: "rejected" },
  ] as SelectOption[],

  // Dynamic FormModal Schema Definition
  formFields: [
    // Section 1: Customer & Product
    {
      name: "product",
      label: "Product",
      type: "select",
      required: true,
      colSpan: 2,
      placeholder: "Select a product",
      section: "Review Overview",
    },
    {
      name: "user",
      label: "Customer",
      type: "select",
      required: true,
      colSpan: 2,
      placeholder: "Select a customer",
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
        { label: "Approved", value: "approved" },
        { label: "Pending Approval", value: "pending" },
        { label: "Rejected", value: "rejected" },
      ],
      section: "Review Overview",
    },
    {
      name: "title",
      label: "Review Headline / Title",
      type: "text",
      required: true,
      colSpan: 4,
      placeholder: "e.g. Outstanding battery life and great build quality!",
      section: "Review Feedback",
    },
    {
      name: "content",
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