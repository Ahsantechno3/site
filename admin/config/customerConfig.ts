import { SelectOption, FormField } from "@/c2/models/FormModal";
import { Download, Plus, RefreshCcwDot } from "lucide-react";

export interface Customer {
  _id: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    avatar: string;
  };
  auth: {
    password?: string;
    loginMethod: string;
    isEmailVerified: boolean;
    lastLogin: string;
  };
  status: "active" | "inactive" | "blocked" | string;
  customerGroup: string;
  address: {
    country: string;
    city: string;
    address: string;
    postalCode: string;
  };
  orders: {
    totalOrders: number;
    completed: number;
    pending: number;
    cancelled: number;
    totalSpent: number;
    averageOrderValue: number;
  };
  cart: {
    totalItems: number;
    items: Array<{ productId: string; quantity: number }>;
  };
  favorites: {
    total: number;
    products: string[];
  };
  activity: {
    totalVisits: number;
    last30Days: number;
    lastVisit: string;
    lastActive: string;
    isOnline: boolean;
    visits: {
      lastVisit: string;
      lastActive: string;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export const customerConfig = {
  routeTitle: "Customers",

  // Tabs config driven from here — "Blocked" is the panel's word for the
  // API's "banned" status (translated in the customers adapter).
  tabs: ["All Customers", "Active", "Inactive", "Suspended", "Blocked"],

  // Header Buttons Control
  buttons: [
    {
      id: "export",
      label: "Export Customers",
      icon: Download,
      variant: "secondary" as const,
      show: true,
      disabled: false,
    },
    {
      id: "new-item",
      label: "Add Customer",
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

  searchFields: [
    "personalInfo.firstName",
    "personalInfo.lastName",
    "personalInfo.email",
    "customerGroup",
  ],

  columnHeaders: {
    _id: "ID",
    name: "Customer Name",
    email: "Email",
    customerGroup: "Customer Group",
    city: "City",
    status: "Status",
  },

  items: [
    {
      _id: "user_001",
      personalInfo: {
        firstName: "James",
        lastName: "Anderson",
        email: "james@example.com",
        phone: "+92 300 1234567",
        avatar: "/uploads/users/james.jpg",
      },
      auth: {
        loginMethod: "email",
        isEmailVerified: true,
        lastLogin: "2026-08-25T10:30:00Z",
      },
      status: "active",
      customerGroup: "VIP",
      address: {
        country: "Pakistan",
        city: "Lahore",
        address: "Model Town",
        postalCode: "54000",
      },
      orders: {
        totalOrders: 18,
        completed: 15,
        pending: 2,
        cancelled: 1,
        totalSpent: 2568.4,
        averageOrderValue: 142.69,
      },
      cart: {
        totalItems: 3,
        items: [
          { productId: "product_101", quantity: 2 },
          { productId: "product_205", quantity: 1 },
        ],
      },
      favorites: {
        total: 8,
        products: ["product_101", "product_205"],
      },
      activity: {
        totalVisits: 42,
        last30Days: 12,
        lastVisit: "2026-08-25T11:20:00Z",
        lastActive: "2026-08-25T11:25:00Z",
        isOnline: true,
        visits: {
          lastVisit: "2026-08-25T11:20:00Z",
          lastActive: "2026-08-25T11:25:00Z",
        },
      },
      createdAt: "2026-08-18T10:30:00Z",
      updatedAt: "2026-08-25T11:25:00Z",
    },
  ] as Customer[],

  mapTableData: (customer: Customer) => ({
    id: customer._id,
    _id: customer._id,
    name: `${customer.personalInfo?.firstName || ""} ${customer.personalInfo?.lastName || ""}`.trim(),
    email: customer.personalInfo?.email || "",
    customerGroup: customer.customerGroup || "",
    city: customer.address?.city ? `${customer.address.city}, ${customer.address.country}` : "",
    status: customer.status || "active",
  }),

  mapDetailData: (customer: Customer) => ({
    id: customer._id,
    title: `${customer.personalInfo?.firstName || ""} ${customer.personalInfo?.lastName || ""}`.trim(),
    status: customer.status,
    image: customer.personalInfo?.avatar,
    shortDescription: `Phone: ${customer.personalInfo?.phone || "N/A"} | Group: ${customer.customerGroup}`,
    attributes: {
      Email: customer.personalInfo?.email,
      Address: `${customer.address?.address}, ${customer.address?.city}`,
      TotalOrders: customer.orders?.totalOrders,
      TotalSpent: `$${customer.orders?.totalSpent?.toFixed(2) || "0.00"}`,
      AvgOrderValue: `$${customer.orders?.averageOrderValue?.toFixed(2) || "0.00"}`,
      CartItems: customer.cart?.totalItems,
      TotalVisits: customer.activity?.totalVisits,
      LastActive: customer.activity?.lastActive ? new Date(customer.activity.lastActive).toLocaleDateString() : "N/A",
    },
  }),

  // Form Modal Mapper for Customer fields
  mapFormData: (customer?: Customer) => {
    if (!customer) {
      return {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        avatar: "",
        role: "customer",
        customerGroup: "Regular",
        status: "active",
        isEmailVerified: false,
        streetAddress: "",
        city: "",
        country: "Pakistan",
        postalCode: "",
      };
    }

    return {
      _id: customer._id,
      firstName: customer.personalInfo?.firstName || "",
      lastName: customer.personalInfo?.lastName || "",
      email: customer.personalInfo?.email || "",
      phone: customer.personalInfo?.phone || "",
      avatar: customer.personalInfo?.avatar || "",
      role: (customer as any).role || "customer",
      customerGroup: customer.customerGroup || "Regular",
      status: customer.status || "active",
      isEmailVerified: customer.auth?.isEmailVerified || false,
      streetAddress: customer.address?.address || "",
      city: customer.address?.city || "",
      country: customer.address?.country || "Pakistan",
      postalCode: customer.address?.postalCode || "",
    };
  },

  filters: [
    {
      id: "customerGroup",
      placeholder: "All Groups",
      options: [
        { label: "All Groups", value: "all" },
        { label: "VIP", value: "VIP" },
        { label: "Regular", value: "Regular" },
        { label: "New", value: "New" },
        { label: "Wholesale", value: "Wholesale" },
      ],
    },
  ],

  // Dynamic Options sent directly to FormModal Select dropdowns
  categoryOptions: [
    { label: "VIP Group", value: "VIP" },
    { label: "Regular Group", value: "Regular" },
    { label: "New Customer", value: "New" },
    { label: "Wholesale", value: "Wholesale" },
  ] as SelectOption[],

  brandOptions: [
    { label: "Customer", value: "customer" },
    { label: "Staff Member", value: "staff" },
    { label: "Vendor", value: "vendor" },
    { label: "Admin", value: "admin" },
  ] as SelectOption[],

  statusOptions: [
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
    { label: "Blocked", value: "blocked" },
    { label: "Suspended", value: "suspended" },
  ] as SelectOption[],

  // Dynamic FormModal Schema Definition
  formFields: [
    // Section 1: Personal Information
    {
      name: "firstName",
      label: "First Name",
      type: "text",
      required: true,
      colSpan: 2,
      placeholder: "e.g. Marcus",
      section: "Personal Information",
    },
    {
      name: "lastName",
      label: "Last Name",
      type: "text",
      required: true,
      colSpan: 2,
      placeholder: "e.g. George",
      section: "Personal Information",
    },
    {
      name: "email",
      label: "Email Address",
      type: "text",
      required: true,
      colSpan: 2,
      placeholder: "e.g. marcus@example.com",
      section: "Personal Information",
    },
    {
      name: "phone",
      label: "Phone Number",
      type: "text",
      colSpan: 2,
      placeholder: "e.g. +92 300 1234567",
      section: "Personal Information",
    },
    {
      name: "avatar",
      label: "Avatar Profile Image URL",
      type: "image",
      colSpan: 4,
      placeholder: "https://...",
      section: "Personal Information",
    },

    // Section 2: Account & Role Settings
    {
      name: "role",
      label: "User Role",
      type: "select",
      required: true,
      colSpan: 1,
      options: [
        { label: "Customer", value: "customer" },
        { label: "Staff Member", value: "staff" },
        { label: "Vendor", value: "vendor" },
        { label: "Admin", value: "admin" },
      ],
      section: "Account & Permissions",
    },
    {
      name: "customerGroup",
      label: "Customer Group / Tier",
      type: "select",
      required: true,
      colSpan: 1,
      options: [
        { label: "Regular", value: "Regular" },
        { label: "VIP", value: "VIP" },
        { label: "New", value: "New" },
        { label: "Wholesale", value: "Wholesale" },
      ],
      section: "Account & Permissions",
    },
    {
      name: "status",
      label: "Account Status",
      type: "select",
      required: true,
      colSpan: 1,
      options: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
        { label: "Blocked", value: "blocked" },
        { label: "Suspended", value: "suspended" },
      ],
      section: "Account & Permissions",
    },
    {
      name: "isEmailVerified",
      label: "Email Verified",
      type: "switch",
      colSpan: 1,
      section: "Account & Permissions",
    },

    // Section 3: Default Delivery Address
    {
      name: "streetAddress",
      label: "Street Address",
      type: "text",
      colSpan: 2,
      placeholder: "e.g. House 45, Street 10",
      section: "Delivery Address",
    },
    {
      name: "city",
      label: "City",
      type: "text",
      colSpan: 1,
      placeholder: "e.g. Lahore",
      section: "Delivery Address",
    },
    {
      name: "country",
      label: "Country",
      type: "text",
      colSpan: 1,
      placeholder: "e.g. Pakistan",
      section: "Delivery Address",
    },
    {
      name: "postalCode",
      label: "Postal / Zip Code",
      type: "text",
      colSpan: 1,
      placeholder: "e.g. 54000",
      section: "Delivery Address",
    },
  ] as FormField[],
};
