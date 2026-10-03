import { SelectOption, FormField } from "@/components/models/FormModal";
import { Download, Plus, RefreshCcwDot } from "lucide-react";

export interface OrderCustomer {
  customerId: string;
  name: string;
  email: string;
  phone: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  total: number;
}

export interface OrderPricing {
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  totalAmount: number;
}

export interface OrderPayment {
  method: string;
  status: "paid" | "unpaid" | "refunded" | string;
  transactionId: string;
}

export interface OrderShipping {
  carrier: string;
  trackingNumber: string;
  address: {
    address: string;
    city: string;
    country: string;
    postalCode: string;
  };
}

export interface Order {
  _id?: string;
  orderId: string;
  customer: OrderCustomer;
  items: OrderItem[];
  pricing: OrderPricing;
  status: "completed" | "pending" | "processing" | "cancelled" | string;
  payment: OrderPayment;
  shipping: OrderShipping;
  orderDate: string;
  createdAt?: string;
  updatedAt?: string;
}

export const orderConfig = {
  routeTitle: "Orders",

  // Tabs for filtering orders — these mirror the Order.status enum in the API.
  tabs: [
    "All Orders",
    "Pending",
    "Confirmed",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
    "Returned",
  ],

  // Action Buttons Controls
  buttons: [
    {
      id: "export",
      label: "Export Orders",
      icon: Download,
      variant: "secondary" as const,
      show: true,
      disabled: false,
    },
    {
      id: "new-item",
      label: "Create Order",
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
  searchFields: [
    "orderId",
    "customer.name",
    "customer.email",
    "shipping.trackingNumber",
  ],

  // Table Headers
  columnHeaders: {
    _id: "Order ID",
    customer: "Customer",
    totalAmount: "Total Amount",
    paymentStatus: "Payment",
    carrier: "Carrier",
    status: "Order Status",
  },

  // Orders List Data
  items: [
    {
      _id: "66d48f21e8a9f1a23b999001",
      orderId: "ORD-2026-1001",
      customer: {
        customerId: "user_001",
        name: "James Anderson",
        email: "james@example.com",
        phone: "+92 300 1234567",
      },
      items: [
        {
          productId: "66d48f21e8a9f1a23b456789",
          name: "Wireless Noise-Canceling Headphones",
          sku: "HD-PRO-100",
          price: 249.99,
          quantity: 1,
          total: 249.99,
        },
      ],
      pricing: {
        subtotal: 249.99,
        discount: 10.0,
        shippingFee: 15.0,
        tax: 5.0,
        totalAmount: 259.99,
      },
      status: "completed",
      payment: {
        method: "credit_card",
        status: "paid",
        transactionId: "TXN_9988776655",
      },
      shipping: {
        carrier: "TCS",
        trackingNumber: "TCS-90210-PK",
        address: {
          address: "Model Town",
          city: "Lahore",
          country: "Pakistan",
          postalCode: "54000",
        },
      },
      orderDate: "2026-08-28T10:30:00Z",
      createdAt: "2026-08-28T10:30:00Z",
      updatedAt: "2026-08-29T14:20:00Z",
    },
    {
      _id: "66d48f21e8a9f1a23b999002",
      orderId: "ORD-2026-1002",
      customer: {
        customerId: "user_002",
        name: "Sarah Khan",
        email: "sarah@example.com",
        phone: "+92 321 7654321",
      },
      items: [
        {
          productId: "66d48f21e8a9f1a23b456790",
          name: "Ergonomic Mesh Chair",
          sku: "CH-ERG-202",
          price: 180.0,
          quantity: 2,
          total: 360.0,
        },
      ],
      pricing: {
        subtotal: 360.0,
        discount: 0.0,
        shippingFee: 25.0,
        tax: 10.0,
        totalAmount: 395.0,
      },
      status: "pending",
      payment: {
        method: "cod",
        status: "unpaid",
        transactionId: "N/A",
      },
      shipping: {
        carrier: "Leopard",
        trackingNumber: "LEO-44321-PK",
        address: {
          address: "Gulberg III",
          city: "Lahore",
          country: "Pakistan",
          postalCode: "54600",
        },
      },
      orderDate: "2026-09-01T09:15:00Z",
      createdAt: "2026-09-01T09:15:00Z",
      updatedAt: "2026-09-01T09:15:00Z",
    },
  ] as Order[],

  // Map Data for CreateTable Component
  mapTableData: (order: Order) => ({
    id: order._id || order.orderId,
    _id: order.orderId,
    customer: order.customer?.name || "N/A",
    totalAmount: `$${order.pricing?.totalAmount?.toFixed(2) || "0.00"}`,
    paymentStatus: order.payment?.status?.toUpperCase() || "UNPAID",
    carrier: order.shipping?.carrier || "N/A",
    status: order.status,
  }),

  // Map Data for DetailPanel Component
  mapDetailData: (order: Order) => ({
    id: order._id || order.orderId,
    title: `Order #${order.orderId}`,
    status: order.status,
    shortDescription: `Customer: ${order.customer?.name || "N/A"} (${order.customer?.email || ""})`,
    attributes: {
      "Customer Phone": order.customer?.phone || "N/A",
      "Total Amount": `$${order.pricing?.totalAmount?.toFixed(2) || "0.00"}`,
      "Subtotal": `$${order.pricing?.subtotal?.toFixed(2) || "0.00"}`,
      "Shipping Fee": `$${order.pricing?.shippingFee?.toFixed(2) || "0.00"}`,
      "Payment Method": order.payment?.method?.toUpperCase() || "N/A",
      "Payment Status": order.payment?.status?.toUpperCase() || "N/A",
      "Carrier": order.shipping?.carrier || "N/A",
      "Tracking Number": order.shipping?.trackingNumber || "N/A",
      "Shipping Address": `${order.shipping?.address?.address || ""}, ${order.shipping?.address?.city || ""}`,
      "Order Date": order.orderDate ? new Date(order.orderDate).toLocaleDateString() : "N/A",
    },
  }),

  // Map Data for FormModal (Add/Edit Mode)
  mapFormData: (order?: Order) => {
    if (!order) {
      return {
        orderId: `ORD-${Date.now().toString().slice(-5)}`,
        status: "pending",
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        paymentMethod: "cod",
        paymentStatus: "unpaid",
        totalAmount: 0,
        carrier: "TCS",
        trackingNumber: "",
        shippingAddress: "",
        shippingCity: "Karachi",
        shippingCountry: "Pakistan",
      };
    }

    return {
      _id: order._id,
      orderId: order.orderId || "",
      status: order.status || "pending",
      customerName: order.customer?.name || "",
      customerEmail: order.customer?.email || "",
      customerPhone: order.customer?.phone || "",
      paymentMethod: order.payment?.method || "cod",
      paymentStatus: order.payment?.status || "unpaid",
      totalAmount: order.pricing?.totalAmount || 0,
      carrier: order.shipping?.carrier || "TCS",
      trackingNumber: order.shipping?.trackingNumber || "",
      shippingAddress: order.shipping?.address?.address || "",
      shippingCity: order.shipping?.address?.city || "",
      shippingCountry: order.shipping?.address?.country || "Pakistan",
    };
  },

  // Table Filters
  filters: [
    {
      id: "paymentStatus",
      placeholder: "Payment Status",
      options: [
        { label: "All Payments", value: "all" },
        { label: "Paid", value: "paid" },
        { label: "Pending", value: "pending" },
        { label: "Refunded", value: "refunded" },
      ],
    },
  ],

  // Select Options for Modal
  categoryOptions: [
    { label: "Credit Card", value: "card" },
    { label: "Cash on Delivery", value: "cod" },
    { label: "Bank Transfer", value: "bank_transfer" },
    { label: "JazzCash / EasyPaisa", value: "wallet" },
  ] as SelectOption[],

  brandOptions: [
    { label: "TCS Express", value: "TCS" },
    { label: "Leopard Courier", value: "Leopard" },
    { label: "DHL Express", value: "DHL" },
    { label: "M&P Logistics", value: "M&P" },
  ] as SelectOption[],

  statusOptions: [
    { label: "Pending", value: "pending" },
    { label: "Confirmed", value: "confirmed" },
    { label: "Processing", value: "processing" },
    { label: "Shipped", value: "shipped" },
    { label: "Delivered", value: "delivered" },
    { label: "Cancelled", value: "cancelled" },
    { label: "Returned", value: "returned" },
  ] as SelectOption[],

  // Dynamic FormModal Schema Definition
  formFields: [
    // Section 1: Order & Amount
    {
      name: "orderId",
      label: "Order Number / ID",
      type: "text",
      required: true,
      colSpan: 2,
      placeholder: "e.g. ORD-2026-1001",
      section: "Order Summary",
    },
    {
      name: "status",
      label: "Order Status",
      type: "select",
      required: true,
      colSpan: 1,
      options: [
        { label: "Pending", value: "pending" },
        { label: "Confirmed", value: "confirmed" },
        { label: "Processing", value: "processing" },
        { label: "Shipped", value: "shipped" },
        { label: "Delivered", value: "delivered" },
        { label: "Cancelled", value: "cancelled" },
        { label: "Returned", value: "returned" },
      ],
      section: "Order Summary",
    },
    {
      name: "totalAmount",
      label: "Total Amount ($)",
      type: "number",
      required: true,
      min: 0,
      colSpan: 1,
      section: "Order Summary",
    },

    // Section 2: Customer Information
    {
      name: "customerName",
      label: "Customer Name",
      type: "text",
      required: true,
      colSpan: 2,
      placeholder: "e.g. James Anderson",
      section: "Customer Information",
    },
    {
      name: "customerEmail",
      label: "Customer Email",
      type: "text",
      required: true,
      colSpan: 1,
      placeholder: "e.g. james@example.com",
      section: "Customer Information",
    },
    {
      name: "customerPhone",
      label: "Customer Phone",
      type: "text",
      colSpan: 1,
      placeholder: "e.g. +92 300 1234567",
      section: "Customer Information",
    },

    // Section 3: Payment & Status
    {
      name: "paymentMethod",
      label: "Payment Method",
      type: "select",
      required: true,
      colSpan: 2,
      options: [
        { label: "Cash on Delivery", value: "cod" },
        { label: "Credit Card / Stripe", value: "card" },
        { label: "Bank Transfer", value: "bank_transfer" },
        { label: "JazzCash / EasyPaisa", value: "wallet" },
      ],
      section: "Payment Details",
    },
    {
      name: "paymentStatus",
      label: "Payment Status",
      type: "select",
      required: true,
      colSpan: 2,
      options: [
        { label: "Pending", value: "pending" },
        { label: "Authorized", value: "authorized" },
        { label: "Paid", value: "paid" },
        { label: "Failed", value: "failed" },
        { label: "Refunded", value: "refunded" },
      ],
      section: "Payment Details",
    },
    {
      name: "transactionId",
      label: "Transaction / Reference ID",
      type: "text",
      colSpan: 2,
      placeholder: "e.g. TXN_9988776655",
      section: "Payment Details",
    },

    // Section 4: Shipping & Fulfillment
    {
      name: "carrier",
      label: "Courier / Carrier",
      type: "select",
      colSpan: 2,
      options: [
        { label: "TCS Express", value: "TCS" },
        { label: "Leopard Courier", value: "Leopard" },
        { label: "DHL Express", value: "DHL" },
        { label: "M&P Logistics", value: "M&P" },
      ],
      section: "Shipping & Fulfillment",
    },
    {
      name: "trackingNumber",
      label: "Tracking Number",
      type: "text",
      colSpan: 2,
      placeholder: "e.g. TRK-98765432",
      section: "Shipping & Fulfillment",
    },
    {
      name: "shippingAddress",
      label: "Delivery Address",
      type: "text",
      colSpan: 2,
      placeholder: "e.g. 124 Main Boulevard",
      section: "Shipping & Fulfillment",
    },
    {
      name: "shippingCity",
      label: "City",
      type: "text",
      colSpan: 1,
      placeholder: "e.g. Karachi",
      section: "Shipping & Fulfillment",
    },
    {
      name: "shippingCountry",
      label: "Country",
      type: "text",
      colSpan: 1,
      placeholder: "e.g. Pakistan",
      section: "Shipping & Fulfillment",
    },
  ] as FormField[],
};
