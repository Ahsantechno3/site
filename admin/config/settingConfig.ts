import { SelectOption, FormField } from "@/c2/models/FormModal";
import { Download, Plus, RefreshCcwDot } from "lucide-react";

export interface SettingItem {
  _id?: string;
  id: number;
  key: string;
  value: any;
  type: "string" | "number" | "boolean" | "object" | "array";
  group: string;
  description?: string;
  isPublic: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const settingConfig = {
  routeTitle: "Settings",

  tabs: ["All Settings", "General", "Localization", "Payment", "Shipping"],

  buttons: [
    {
      id: "export",
      label: "Export Settings",
      icon: Download,
      variant: "secondary" as const,
      show: true,
      disabled: false,
    },
    {
      id: "new-item",
      label: "Add Setting",
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

  searchFields: ["key", "group", "description"],

  columnHeaders: {
    _id: "Setting Key",
    group: "Group",
    value: "Configured Value",
    type: "Data Type",
    isPublic: "Public API",
  },

  items: [
    {
      _id: "set_001",
      id: 1,
      key: "store_name",
      value: "Ecom Global Store",
      type: "string",
      group: "general",
      description: "Official store title displayed in emails and website header.",
      isPublic: true,
      createdAt: "2026-08-01T00:00:00Z",
    },
    {
      _id: "set_002",
      id: 2,
      key: "store_currency",
      value: "USD",
      type: "string",
      group: "localization",
      description: "Default checkout currency ISO-4217 code.",
      isPublic: true,
      createdAt: "2026-08-01T00:00:00Z",
    },
    {
      _id: "set_003",
      id: 3,
      key: "free_shipping_threshold",
      value: 100,
      type: "number",
      group: "shipping",
      description: "Cart subtotal threshold required to waive delivery costs.",
      isPublic: true,
      createdAt: "2026-08-01T00:00:00Z",
    },
    {
      _id: "set_004",
      id: 4,
      key: "tax_percentage",
      value: 5,
      type: "number",
      group: "payment",
      description: "Default standard value-added sales tax rate percentage.",
      isPublic: false,
      createdAt: "2026-08-01T00:00:00Z",
    },
    {
      _id: "set_005",
      id: 5,
      key: "maintenance_mode",
      value: false,
      type: "boolean",
      group: "general",
      description: "When enabled, public storefront displays maintenance banner.",
      isPublic: true,
      createdAt: "2026-08-01T00:00:00Z",
    },
    {
      _id: "set_006",
      id: 6,
      key: "contact_email",
      value: "support@ecomstore.com",
      type: "string",
      group: "general",
      description: "Support customer service contact inbox.",
      isPublic: true,
      createdAt: "2026-08-01T00:00:00Z",
    },
  ] as SettingItem[],

  mapTableData: (setting: SettingItem) => ({
    id: setting._id || String(setting.id),
    _id: setting.key,
    group: setting.group.toUpperCase(),
    value: String(setting.value),
    type: setting.type,
    isPublic: setting.isPublic ? "Yes (Public)" : "No (Private)",
  }),

  mapDetailData: (setting: SettingItem) => ({
    id: setting._id || String(setting.id),
    title: setting.key,
    status: setting.isPublic ? "public" : "private",
    shortDescription: setting.description || `Group: ${setting.group}`,
    attributes: {
      "Setting Key": setting.key,
      Value: String(setting.value),
      "Data Type": setting.type,
      Group: setting.group,
      "Public API Exposure": setting.isPublic ? "Yes" : "No",
      "Created Date": setting.createdAt ? new Date(setting.createdAt).toLocaleDateString() : "N/A",
    },
    description: setting.description || "",
  }),

  mapFormData: (setting?: SettingItem) => {
    if (!setting) {
      return {
        key: "",
        value: "",
        type: "string",
        group: "general",
        isPublic: true,
        description: "",
      };
    }

    return {
      _id: setting._id,
      id: setting.id,
      key: setting.key || "",
      value: setting.value !== undefined ? String(setting.value) : "",
      type: setting.type || "string",
      group: setting.group || "general",
      isPublic: Boolean(setting.isPublic),
      description: setting.description || "",
    };
  },

  filters: [
    {
      id: "group",
      placeholder: "Setting Group",
      options: [
        { label: "All Groups", value: "all" },
        { label: "General", value: "general" },
        { label: "Localization", value: "localization" },
        { label: "Payment", value: "payment" },
        { label: "Shipping", value: "shipping" },
      ],
    },
  ],

  categoryOptions: [] as SelectOption[],
  brandOptions: [] as SelectOption[],
  statusOptions: [] as SelectOption[],

  // Dynamic FormModal Schema Definition
  formFields: [
    // Section 1: Setting Configuration
    {
      name: "key",
      label: "Setting Key (Unique Variable)",
      type: "text",
      required: true,
      colSpan: 2,
      placeholder: "e.g. store_name, currency_symbol",
      section: "Configuration",
    },
    {
      name: "group",
      label: "Category Group",
      type: "select",
      required: true,
      colSpan: 1,
      options: [
        { label: "General", value: "general" },
        { label: "Localization", value: "localization" },
        { label: "Payment & Taxes", value: "payment" },
        { label: "Shipping & Delivery", value: "shipping" },
        { label: "Email Notifications", value: "email" },
        { label: "Social Media", value: "social" },
        { label: "SEO & Analytics", value: "seo" },
      ],
      section: "Configuration",
    },
    {
      name: "type",
      label: "Value Data Type",
      type: "select",
      required: true,
      colSpan: 1,
      options: [
        { label: "String (Text)", value: "string" },
        { label: "Number (Integer/Float)", value: "number" },
        { label: "Boolean (True/False)", value: "boolean" },
        { label: "JSON Object", value: "object" },
        { label: "Array", value: "array" },
      ],
      section: "Configuration",
    },
    {
      name: "value",
      label: "Setting Value",
      type: "text",
      required: true,
      colSpan: 3,
      placeholder: "Enter value...",
      section: "Configuration",
    },
    {
      name: "isPublic",
      label: "Expose to Public API (Frontend visible)",
      type: "switch",
      colSpan: 1,
      section: "Configuration",
    },

    // Section 2: Usage Guide
    {
      name: "description",
      label: "Setting Description & Internal Notes",
      type: "textarea",
      rows: 3,
      colSpan: 4,
      placeholder: "Explain what this setting controls...",
      section: "Usage Notes",
    },
  ] as FormField[],
};
