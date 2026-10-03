const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema(
  {
    // 1. General Settings
    general: {
      storeName: { type: String, default: "" },
      storeTagline: { type: String, default: "" },
      storeEmail: { type: String, default: "" },
      phone: { type: String, default: "" },
      timeZone: { type: String, default: "" },
      language: { type: String, default: "English" },
      logo: { type: String, default: "" },
      favicon: { type: String, default: "" },
    },

    // 2. Store Information
    storeInfo: {
      businessName: { type: String, default: "" },
      businessType: { type: String, default: "" },
      taxId: { type: String },
      website: { type: String, default: "" },
      address: {
        addressLine1: { type: String, default: "" },
        addressLine2: { type: String },
        city: { type: String },
        state: { type: String },
        postalCode: { type: String },
        country: { type: String },
      },
    },

    // 3. Payment Methods
    paymentMethods: [
      {
        name: { type: String, required: true }, // e.g. Stripe, PayPal, Cash on Delivery
        description: { type: String },
        enabled: { type: Boolean, default: true },
      },
    ],

    // 4. Shipping Settings
    shipping: {
      zones: [
        {
          name: { type: String, required: true }, // e.g. Pakistan, Europe
          regions: [String],
          rate: { type: Number, required: true },
          isActive: { type: Boolean, default: true },
        },
      ],
      freeShippingThreshold: { type: Number, default: 100 },
      defaultShippingMethod: { type: String, default: "Standard Shipping" },
    },

    // 5. Notifications
    notifications: {
      newOrder: { type: Boolean, default: true },
      lowStock: { type: Boolean, default: true },
      customerMessages: { type: Boolean, default: true },
      marketingUpdates: { type: Boolean, default: false },
      systemNotifications: { type: Boolean, default: true },
    },

    // 6. UPDATED: Universal / Dynamic Integrations (Zero-Selection Architecture)
    integrations: [
      {
        usageType: {
          type: String,
          enum: [
            "STORAGE",
            "PAYMENT",
            "SMS_NOTIFICATION",
            "EMAIL",
            "AUTH",
            "API",
          ],
          required: true,
        },
        serviceSlug: { type: String, required: true, trim: true }, // Unique identifier (e.g. "my-sms-api")
        title: { type: String, required: true }, // Name given by Admin
        baseUrl: { type: String, required: true, trim: true }, // API Base URL
        authType: {
          type: String,
          enum: ["API_KEY", "BEARER_TOKEN", "BASIC", "CUSTOM_HEADER", "NONE"],
          default: "NONE",
        },
        authCredentials: {
          apiKey: { type: String, default: "" },
          headerKey: { type: String, default: "Authorization" }, // Custom Header Name
          username: { type: String, default: "" },
          password: { type: String, default: "" },
        },
        globalHeaders: { type: Map, of: String, default: {} },
        endpoints: [
          {
            name: { type: String, required: true }, // Action Name e.g. "send_otp"
            path: { type: String, required: true }, // Endpoint Path e.g. "/v1/send"
            method: {
              type: String,
              enum: ["GET", "POST", "PUT", "DELETE", "PATCH"],
              default: "POST",
            },
            defaultHeaders: { type: Map, of: String, default: {} },
            responseMapping: {
              successField: { type: String, default: "" },
              dataField: { type: String, default: "" }, // e.g. "data.url"
              errorField: { type: String, default: "" },
            },
          },
        ],
        webhooks: [
          {
            event: { type: String, required: true }, // e.g. order.created
            url: { type: String, required: true },
            isActive: { type: Boolean, default: true },
          },
        ],
        isConnected: { type: Boolean, default: true },
      },
    ],

    // 7. Appearance
    appearance: {
      theme: {
        type: String,
        enum: ["Light", "Dark", "System"],
        default: "Light",
      },
      compactSidebar: { type: Boolean, default: false },
      showBreadcrumbs: { type: Boolean, default: true },
      enableAnimations: { type: Boolean, default: true },
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Setting", settingSchema);
