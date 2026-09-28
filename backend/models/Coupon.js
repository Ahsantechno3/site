// models/Coupon.js
const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  // Basic Information
  code: { 
    type: String, 
    required: true, 
    unique: true,
    uppercase: true,
    trim: true
  },
  description: { 
    type: String 
  },
  
  // Discount Type
  discountType: { 
    type: String, 
    enum: ['percentage', 'fixed'], 
    required: true 
  },
  discountValue: { 
    type: Number, 
    required: true,
    min: 0
  },
  
  // Usage Limits
  minPurchaseAmount: { 
    type: Number, 
    default: 0 
  },
  maxDiscountAmount: { 
    type: Number 
  },
  usageLimit: { 
    type: Number, 
    default: null // null means unlimited
  },
  usedCount: { 
    type: Number, 
    default: 0 
  },
  
  // Validity
  validFrom: { 
    type: Date, 
    required: true 
  },
  validUntil: { 
    type: Date, 
    required: true 
  },
  
  // Applicability
  applicableProducts: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product' 
  }],
  applicableCategories: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category' 
  }],
  applicableUsers: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  
  // Status
  isActive: { 
    type: Boolean, 
    default: true 
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

// Indexes
couponSchema.index({ validFrom: 1, validUntil: 1 });
couponSchema.index({ isActive: 1 });

module.exports = mongoose.model('Coupon', couponSchema);