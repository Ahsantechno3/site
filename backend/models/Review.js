// models/Review.js
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  // Review Content
  title: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 100
  },
  content: { 
    type: String, 
    required: true,
    maxlength: 1000
  },
  
  // Rating
  rating: { 
    type: Number, 
    required: true,
    min: 1,
    max: 5
  },
  
  // Relationships
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  product: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product',
    required: true 
  },
  
  // Media (Images/Videos)
  media: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Media' 
  }],
  
  // Helpful Votes
  helpfulVotes: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  helpfulCount: { 
    type: Number, 
    default: 0 
  },
  
  // Status
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  
  // Reply (Admin/Vendor)
  reply: {
    content: { type: String },
    repliedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    repliedAt: { type: Date }
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
reviewSchema.index({ user: 1, product: 1 }, { unique: true });
reviewSchema.index({ product: 1, status: 1 });
reviewSchema.index({ rating: -1 });

module.exports = mongoose.model('Review', reviewSchema);