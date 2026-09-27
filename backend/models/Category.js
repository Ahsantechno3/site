// models/Category.js
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 100
  },
  slug: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  description: { type: String, maxlength: 500 },
  image: { type: String },
  
  // Hierarchy (Parent-Child)
  parent: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category',
    default: null 
  },
  
  // SEO
  metaTitle: { type: String, maxlength: 60 },
  metaDescription: { type: String, maxlength: 160 },
  
  // Status
  isActive: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
}, {
  timestamps: true
});

// Index for better performance
categorySchema.index({ parent: 1 });
categorySchema.index({ slug: 1 });

module.exports = mongoose.model('Category', categorySchema);