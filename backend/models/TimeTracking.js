const mongoose = require('mongoose');

const timeTrackingSchema = new mongoose.Schema({
  userId: {
    type: String, // Changed to String to support both ObjectId and anonymous userIds
    required: true,
    index: true
  },
  module: {
    type: String,
    required: true,
    enum: ['Sanskriti', 'Exam AI', 'Upskilling', 'College Search', 'Career Assessment', 'Future Me Card']
  },
  sessionStart: {
    type: Date,
    required: true
  },
  sessionEnd: {
    type: Date,
    required: true
  },
  duration: {
    type: Number, // Duration in seconds
    required: true
  },
  route: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for faster queries - userId is now String type
timeTrackingSchema.index({ userId: 1, module: 1, createdAt: -1 });
timeTrackingSchema.index({ module: 1, createdAt: -1 });

module.exports = mongoose.model('TimeTracking', timeTrackingSchema);

