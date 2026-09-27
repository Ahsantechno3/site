import { SelectOption, FormField } from "@/c2/models/FormModal";
import { Download, Plus, RefreshCcwDot } from "lucide-react";

export interface Coupon {
  _id?: string;
  id: number;
  code: string;
  type: "percentage" | "fixed_amount" | "free_shipping" | string;
  value: number;
  minPurchaseAmount?: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  usedCount: number;
  startDate: string;
  endDate: string;
  status: "active" | "expired" | "disabled" | string;
  description?: string;
  createdAt?: string;
}

export const couponConfig = {
  routeTitle: "Coupons",

  // Tabs status wise filter
  tabs: ["All Coupons", "Active", "Expired", "Disabled"],

  // Action Buttons
  buttons: [
    {
      id: "export",
      label: "Export Coupons",
      icon: Download,
      variant: "secondary" as const,
      show: true,
      disabled: false,
    },
    {
      id: "new-item",
      label: "Add Coupon",
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
  searchFields: ["code", "type", "description"],

  // Table Column Labels
  columnHeaders: {
    _id: "ID",
    code: "Coupon Code",
    type: "Discount Type",
    value: "Value",
    usage: "Usage",
    status: "Status",
  },

  // Dummy Items Data
  items: [
    {
      _id: "66d48f21e8a9f1a23b777001",
      id: 1,
      code: "SUMMER2026",
      type: "percentage",
      value: 20,
      minPurchaseAmount: 100,
      maxDiscountAmount: 50,
      usageLimit: 500,
      usedCount: 142,
      startDate: "2026-06-01T00:00:00Z",
      endDate: "2026-09-30T23:59:59Z",
      status: "active",
      description: "Get 20% off on all summer products above $100.",
      createdAt: "2026-05-25T10:00:00Z",
    },
    {
      _id: "66d48f21e8a9f1a23b777002",
      id: 2,
      code: "WELCOME10",
      type: "fixed_amount",
      value: 10,
      minPurchaseAmount: 30,
      maxDiscountAmount: 10,
      usageLimit: 1000,
      usedCount: 1000,
      startDate: "2026-01-01T00:00:00Z",
      endDate: "2026-08-31T23:59:59Z",
      status: "expired",
      description: "$10 flat discount for first-time buyers.",
      createdAt: "2026-01-01T08:00:00Z",
    },
  ] as Coupon[],

  // Map Data for CreateTable Component
  mapTableData: (coupon: Coupon) => ({
    id: coupon._id || String(coupon.id),
    _id: coupon.code,
    code: coupon.code,
    type: coupon.type === "percentage" ? "Percentage (%)" : "Fixed Amount ($)",
    value: coupon.type === "percentage" ? `${coupon.value}%` : `$${coupon.value.toFixed(2)}`,
    usage: `${coupon.usedCount} / ${coupon.usageLimit || "∞"}`,
    status: coupon.status,
  }),

  // Map Data for DetailPanel Component
  mapDetailData: (coupon: Coupon) => ({
    id: coupon._id || String(coupon.id),
    title: `Code: ${coupon.code}`,
    status: coupon.status,
    shortDescription: coupon.description || `Discount: ${coupon.value}${coupon.type === "percentage" ? "%" : "$"}`,
    attributes: {
      "Coupon Code": coupon.code,
      "Discount Type": coupon.type?.toUpperCase() || "N/A",
      "Discount Value": coupon.type === "percentage" ? `${coupon.value}%` : `$${coupon.value}`,
      "Min Purchase": coupon.minPurchaseAmount ? `$${coupon.minPurchaseAmount}` : "None",
      "Max Discount": coupon.maxDiscountAmount ? `$${coupon.maxDiscountAmount}` : "N/A",
      "Usage Limit": coupon.usageLimit ? `${coupon.usedCount} / ${coupon.usageLimit}` : `${coupon.usedCount} (No Limit)`,
      "Start Date": coupon.startDate ? new Date(coupon.startDate).toLocaleDateString() : "N/A",
      "End Date": coupon.endDate ? new Date(coupon.endDate).toLocaleDateString() : "N/A",
    },
    description: coupon.description || "",
  }),

  // Map Data for FormModal (Add/Edit Mode)
  mapFormData: (coupon?: Coupon) => {
    if (!coupon) {
      return {
        code: "",
        type: "percentage",
        value: 10,
        minPurchaseAmount: 0,
        maxDiscountAmount: 0,
        usageLimit: 100,
        perUserLimit: 1,
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        status: "active",
        description: "",
      };
    }

    return {
      _id: coupon._id,
      id: coupon.id,
      code: coupon.code || "",
      type: coupon.type || "percentage",
      value: coupon.value || 0,
      minPurchaseAmount: coupon.minPurchaseAmount || 0,
      maxDiscountAmount: coupon.maxDiscountAmount || 0,
      usageLimit: coupon.usageLimit || 0,
      perUserLimit: (coupon as any).perUserLimit || 1,
      startDate: coupon.startDate || "",
      endDate: coupon.endDate || "",
      status: coupon.status || "active",
      description: coupon.description || "",
    };
  },

  // Table Filters
  filters: [
    {
      id: "type",
      placeholder: "Discount Type",
      options: [
        { label: "All Types", value: "all" },
        { label: "Percentage", value: "percentage" },
        { label: "Fixed Amount", value: "fixed_amount" },
        { label: "Free Shipping", value: "free_shipping" },
      ],
    },
  ],

  // FormModal Dropdown Options
  categoryOptions: [
    { label: "Percentage (%)", value: "percentage" },
    { label: "Fixed Amount ($)", value: "fixed_amount" },
    { label: "Free Shipping", value: "free_shipping" },
  ] as SelectOption[],

  brandOptions: [
    { label: "Unlimited Usage", value: "unlimited" },
    { label: "Limited Usage", value: "limited" },
  ] as SelectOption[],

  statusOptions: [
    { label: "Active", value: "active" },
    { label: "Expired", value: "expired" },
    { label: "Disabled", value: "disabled" },
  ] as SelectOption[],

  // Dynamic FormModal Schema Definition
  formFields: [
    // Section 1: Coupon Basics
    {
      name: "code",
      label: "Coupon Code",
      type: "text",
      required: true,
      colSpan: 2,
      placeholder: "e.g. SUMMER2026",
      section: "Coupon Details",
    },
    {
      name: "type",
      label: "Discount Type",
      type: "select",
      required: true,
      colSpan: 1,
      options: [
        { label: "Percentage (%)", value: "percentage" },
        { label: "Fixed Amount ($)", value: "fixed_amount" },
        { label: "Free Shipping", value: "free_shipping" },
      ],
      section: "Coupon Details",
    },
    {
      name: "value",
      label: "Discount Value (% or $)",
      type: "number",
      required: true,
      min: 0,
      colSpan: 1,
      section: "Coupon Details",
    },
    {
      name: "status",
      label: "Coupon Status",
      type: "select",
      required: true,
      colSpan: 2,
      options: [
        { label: "Active", value: "active" },
        { label: "Expired", value: "expired" },
        { label: "Disabled", value: "disabled" },
      ],
      section: "Coupon Details",
    },

    // Section 2: Limits & Conditions
    {
      name: "minPurchaseAmount",
      label: "Minimum Spend ($)",
      type: "number",
      min: 0,
      colSpan: 1,
      section: "Discount Rules & Limits",
    },
    {
      name: "maxDiscountAmount",
      label: "Max Discount Ceiling ($)",
      type: "number",
      min: 0,
      colSpan: 1,
      section: "Discount Rules & Limits",
    },
    {
      name: "usageLimit",
      label: "Total Usage Limit",
      type: "number",
      min: 1,
      colSpan: 1,
      section: "Discount Rules & Limits",
    },
    {
      name: "perUserLimit",
      label: "Limit Per Customer",
      type: "number",
      min: 1,
      colSpan: 1,
      section: "Discount Rules & Limits",
    },

    // Section 3: Dates & Description
    {
      name: "startDate",
      label: "Valid From (Start Date)",
      type: "date",
      required: true,
      colSpan: 2,
      section: "Validity Schedule",
    },
    {
      name: "endDate",
      label: "Valid Until (End Date)",
      type: "date",
      required: true,
      colSpan: 2,
      section: "Validity Schedule",
    },
    {
      name: "description",
      label: "Campaign Description",
      type: "textarea",
      rows: 2,
      colSpan: 4,
      placeholder: "e.g. 15% discount for summer promotional sale...",
      section: "Validity Schedule",
    },
  ] as FormField[],
};