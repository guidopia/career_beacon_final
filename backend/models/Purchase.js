const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  module: { 
    type: String, 
    required: true,
    enum: ['sanskriti', 'upskilling', 'career-assessment', 'school-assessment', 'all-modules']
  },
  amount: { type: Number, required: true },
  paymentId: { type: String, required: true },
  orderId: { type: String, required: true },
  phone: { type: String, required: true },
  status: { 
    type: String, 
    required: true,
    enum: ['pending', 'completed', 'failed']
  },
  purchasedAt: { type: Date, default: Date.now },
  expiresAt: { 
    type: Date, 
    required: true,
    default: function() {
      // Set expiration to 1 year from purchase date
      const date = new Date();
      date.setFullYear(date.getFullYear() + 1);
      return date;
    }
  }
});

// Add method to check if purchase is still valid
purchaseSchema.methods.isValid = function() {
  return this.status === 'completed' && new Date() < this.expiresAt;
};

// Add index for faster queries
purchaseSchema.index({ user: 1, module: 1 });

module.exports = mongoose.model('Purchase', purchaseSchema);
