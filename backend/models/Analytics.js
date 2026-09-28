const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  trafficSources: {
    direct: { type: Number, default: 0 },
    organicSearch: { type: Number, default: 0 },
    socialMedia: { type: Number, default: 0 },
    referral: { type: Number, default: 0 },
    emailCampaign: { type: Number, default: 0 }
  },
  conversionStats: {
    productViews: { type: Number, default: 0 },
    addToCart: { type: Number, default: 0 },
    proceedToCheckout: { type: Number, default: 0 },
    checkoutSuccess: { type: Number, default: 0 },
    completed: { type: Number, default: 0 }
  },
  monthlyTarget: {
    achievedPercentage: { type: Number, default: 0 },
    targetAmount: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 }
  }
}, { timestamps: true });

module.exports = mongoose.model('Analytics', analyticsSchema);

