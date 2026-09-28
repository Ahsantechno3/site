const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  type: { 
    type: String, 
    enum: ['PURCHASE', 'PRICE_UPDATE', 'REVIEW', 'STOCK_ALERT', 'STATUS_CHANGE'],
    required: true
  },
  description: { type: String, required: true },
  metadata: {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Assuming User handles customers
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' }
  }
}, { timestamps: true });

module.exports = mongoose.model('ActivityLog', activityLogSchema);

