// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  // Basic Info
  name: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 200
  },
  slug: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  sku: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true
  },
  description: { 
    type: String,
    required: true,
    maxlength: 2000
  },
  
  // Pricing
  price: { 
    type: Number, 
    required: true,
    min: 0
  },
  comparePrice: { 
    type: Number,
    min: 0,
    validate: {
      validator: function(value) {
        return value > this.price;
      },
      message: 'Compare price must be greater than price'
    }
  },
  costPrice: { 
    type: Number,
    min: 0
  },
  
  // Inventory
  stock: { 
    type: Number, 
    required: true, 
    default: 0,
    min: 0
  },
  lowStockThreshold: { 
    type: Number, 
    default: 10 
  },
  
  // Category & Brand
  category: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category',
    required: true 
  },
  brand: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Brand' 
  },
  
  // Images
  images: [{
    url: { type: String, required: true },
    altText: { type: String },
    isPrimary: { type: Boolean, default: false }
  }],
  
  // Variants (Size, Color, etc.)
  variants: [{
    name: { type: String, required: true }, // e.g., "Size", "Color"
    options: [{ type: String, required: true }], // e.g., ["S", "M", "L"]
    price: { type: Number, min: 0 },
    stock: { type: Number, min: 0, default: 0 },
    sku: { type: String }
  }],
  
  // Attributes
  attributes: [{
    name: { type: String, required: true },
    value: { type: String, required: true }
  }],
  
  // SEO
  metaTitle: { type: String, maxlength: 60 },
  metaDescription: { type: String, maxlength: 160 },
  
  // Status
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'draft', 'published', 'pending_review', 'rejected', 'archived'],
    default: 'draft' 
  },
  
  // Shipping
  weight: { type: Number, min: 0 },
  dimensions: {
    length: { type: Number, min: 0 },
    width: { type: Number, min: 0 },
    height: { type: Number, min: 0 }
  },
  
  // Ratings
  averageRating: { 
    type: Number, 
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: { 
    type: Number, 
    default: 0,
    min: 0
  },
  
  // Tags
  tags: [{ type: String, trim: true }],
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
}, {
  timestamps: true
});

// Indexes for better performance
productSchema.index({ category: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ status: 1 });
productSchema.index({ price: 1 });
productSchema.index({ averageRating: -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ name: 'text', description: 'text' }); // Text search

module.exports = mongoose.model('Product', productSchema);