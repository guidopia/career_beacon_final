const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true },
  email: String,
  name: String,
  age: Number,
  gender: String,

  hasPlatformAccess: { type: Boolean, default: false },


            // Add these fields to your existing User schema
  purchasedCourses: { 
    type: [String], 
    default: [] 
  },
  
  phone: { 
    type: String, 
    required: false 
  },
  about: String,
  socialLinks: [{
    platform: String,
    url: String
  }],
  // Experience: Array of job/role experiences
  experience: [{
    title: { type: String },
    company: { type: String },
    description: { type: String },
    startDate: { type: String },
    endDate: { type: String },
    current: { type: Boolean, default: false }
  }],
  skillsInProgress: [{
    name: String,
    progress: Number
  }],
  completionCertificates: [{
    name: String,
    organization: String
  }],
  personalityType: String,
  // Add personality scores for Big 5 traits
  personalityScores: {
    openness: { type: Number, default: 0 },
    conscientiousness: { type: Number, default: 0 },
    extraversion: { type: Number, default: 0 },
    agreeableness: { type: Number, default: 0 },
    neuroticism: { type: Number, default: 0 }
  },
  careerRecommendations: [String],
  skillRecommendations: [String],
  onboardingComplete: { type: Boolean, default: false },
  onboardingAnswers: {
    type: Map,
    of: String,
    default: {}
  },
  onboarding: { type: mongoose.Schema.Types.ObjectId, ref: 'Onboarding' },
  futureMeCard: { type: mongoose.Schema.Types.ObjectId, ref: 'FutureMeCard' },
    
    // Add these fields to your existing User schema
       
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: Date.now },
  profilePic: { type: String, default: '' },
  activityLog: [{
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  }]
});

module.exports = mongoose.model('User', userSchema);
