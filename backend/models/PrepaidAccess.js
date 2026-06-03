const mongoose = require('mongoose');

const prepaidAccessSchema = new mongoose.Schema({
  email: { type: String, index: true },
  phone: { type: String, index: true },
  module: {
    type: String,
    required: true,
    enum: ['sanskriti', 'upskilling', 'career-assessment', 'school-assessment', 'all-modules']
  },
  expiresAt: { type: Date },
  note: { type: String },
  redeemed: { type: Boolean, default: false },
  redeemedAt: { type: Date },
  redeemedByUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

prepaidAccessSchema.index({ email: 1, phone: 1, module: 1, redeemed: 1 });

module.exports = mongoose.model('PrepaidAccess', prepaidAccessSchema);


