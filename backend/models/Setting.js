// models/Setting.js
const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  // General Settings
  siteName: { 
    type: String, 
    required: true,
    default: 'E-commerce Store'
  },
  siteDescription: { 
    type: String 
  },
  siteLogo: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Media' 
  },
  favicon: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Media' 
  },
  
  // Contact Information
  contactEmail: { 
    type: String 
  },
  contactPhone: { 
    type: String 
  },
  contactAddress: { 
    type: String 
  },
  
  // Social Media Links
  socialMedia: {
    facebook: { type: String },
    twitter: { type: String },
    instagram: { type: String },
    linkedin: { type: String },
    youtube: { type: String }
  },
  
  // SEO Settings
  seo: {
    metaTitle: { type: String },
    metaDescription: { type: String },
    metaKeywords: [{ type: String }],
    googleAnalyticsId: { type: String }
  },
  
  // Email Settings
  emailSettings: {
    smtpHost: { type: String },
    smtpPort: { type: Number },
    smtpUsername: { type: String },
    smtpPassword: { type: String },
    smtpEncryption: { type: String, enum: ['tls', 'ssl', 'none'] },
    fromEmail: { type: String },
    fromName: { type: String }
  },
  
  // Payment Settings
  paymentSettings: {
    currency: { type: String, default: 'USD' },
    currencySymbol: { type: String, default: '$' },
    stripePublicKey: { type: String },
    stripeSecretKey: { type: String },
    paypalClientId: { type: String },
    paypalClientSecret: { type: String },
    paymentMethods: [{ type: String }]
  },
  
  // Shipping Settings
  shippingSettings: {
    freeShippingEnabled: { type: Boolean, default: false },
    freeShippingMinAmount: { type: Number, default: 0 },
    shippingRates: [{
      name: { type: String },
      rate: { type: Number },
      estimatedDays: { type: Number }
    }]
  },
  
  // Tax Settings
  taxSettings: {
    taxEnabled: { type: Boolean, default: false },
    taxRate: { type: Number, default: 0 },
    taxIncludedInPrice: { type: Boolean, default: false }
  },
  
  // Notification Settings
  notifications: {
    emailNotifications: { type: Boolean, default: true },
    smsNotifications: { type: Boolean, default: false },
    orderConfirmation: { type: Boolean, default: true },
    shippingUpdates: { type: Boolean, default: true },
    promotionalEmails: { type: Boolean, default: false }
  },
  
  // Maintenance Mode
  maintenanceMode: { 
    type: Boolean, 
    default: false 
  },
  maintenanceMessage: { 
    type: String 
  },
  
  // Timestamps
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date 
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Setting', settingSchema);