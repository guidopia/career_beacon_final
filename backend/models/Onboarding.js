const mongoose = require('mongoose');

const onboardingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  phoneNumber: { type: String, required: true },
  studentType: { type: String, required: true, enum: ['school', 'college'] },
  
  // School specific fields
  schoolClass: { type: String },
  schoolStream: { type: String },
  strongestAreas: [{ type: String }],
  learningFormats: [{ type: String }],
  motivation: { type: String },
  futureExcitement: { type: String },
  
  // College specific fields
  collegeYear: { type: String },
  collegeDegree: { type: String },
  otherDegree: { type: String },
  strengths: [{ type: String }],
  careerGoals: [{ type: String }],
  industries: [{ type: String }],
  lifestyle: { type: String },
  learningPreference: [{ type: String }],
  
  // Common fields
  joiningReason: { type: String },
  otherReason: { type: String },
  
  completedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Onboarding', onboardingSchema);
