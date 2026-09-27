// models/Media.js
const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  // File Information
  filename: { 
    type: String, 
    required: true 
  },
  originalName: { 
    type: String, 
    required: true 
  },
  url: { 
    type: String, 
    required: true 
  },
  path: { 
    type: String, 
    required: true 
  },
  
  // File Type & Size
  mimeType: { 
    type: String, 
    required: true,
    enum: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/mov', 'application/pdf', 'application/msword']
  },
  size: { 
    type: Number, 
    required: true 
  },
  extension: { 
    type: String, 
    required: true 
  },
  
  // Dimensions (for images)
  dimensions: {
    width: { type: Number },
    height: { type: Number }
  },
  
  // Storage Type
  storageType: { 
    type: String, 
    enum: ['local', 'cloud', 'gridfs'], 
    default: 'local' 
  },
  
  // GridFS Reference (if using GridFS)
  gridFsFileId: { 
    type: mongoose.Schema.Types.ObjectId 
  },
  
  // Uploaded By
  uploadedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  
  // Associated Entity
  entityType: { 
    type: String, 
    enum: ['product', 'category', 'brand', 'user', 'review', 'setting', 'other'],
    default: 'other'
  },
  entityId: { 
    type: mongoose.Schema.Types.ObjectId 
  },
  
  // Image Variants (thumbnails, etc.)
  variants: [{
    name: { type: String }, // 'thumbnail', 'medium', 'large'
    url: { type: String },
    path: { type: String },
    width: { type: Number },
    height: { type: Number },
    size: { type: Number }
  }],
  
  // Metadata
  title: { type: String },
  altText: { type: String },
  description: { type: String },
  tags: [{ type: String }],
  
  // Status
  isActive: { 
    type: Boolean, 
    default: true 
  },
  isPublic: { 
    type: Boolean, 
    default: true 
  },
  
  // Usage Count
  usageCount: { 
    type: Number, 
    default: 0 
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

// Indexes for better performance
mediaSchema.index({ uploadedBy: 1 });
mediaSchema.index({ entityType: 1, entityId: 1 });
mediaSchema.index({ mimeType: 1 });
mediaSchema.index({ createdAt: -1 });

// Method to get public URL
mediaSchema.methods.getPublicUrl = function() {
  return this.url;
};

// Method to check if file is image
mediaSchema.methods.isImage = function() {
  return this.mimeType.startsWith('image/');
};

// Method to check if file is video
mediaSchema.methods.isVideo = function() {
  return this.mimeType.startsWith('video/');
};

module.exports = mongoose.model('Media', mediaSchema);