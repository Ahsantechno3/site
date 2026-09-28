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

    // 6. API Settings
    apiSettings: {
      publicKey: { type: String },
      secretKey: { type: String },
      webhooks: [
        {
          event: { type: String, required: true }, // e.g. order.created
          url: { type: String, required: true },
          isActive: { type: Boolean, default: true },
        },
      ],
    },

    // 7. Integrations
    integrations: [
      {
        name: { type: String, required: true }, // e.g. Google Analytics, Mailchimp
        description: { type: String },
        isConnected: { type: Boolean, default: false },
        config: { type: mongoose.Schema.Types.Mixed }, // API tokens or tracking IDs
      },
    ],

    // 8. Appearance
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
