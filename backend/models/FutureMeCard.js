const mongoose = require('mongoose');

const futureMeCardSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  answers: { type: Object, required: true },
  futureRole: { type: String, required: true },
  tagline: { type: String },
  tags: [{ type: String }],
  mindset: { type: String },
  salary: { type: String },
  keySkills: [{ type: String }],
  mentors: [{ type: String }],
  cta: { type: String },
  personalityType: { type: String },
  careerRecommendations: [{ type: String }],
  skillRecommendations: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FutureMeCard', futureMeCardSchema);
