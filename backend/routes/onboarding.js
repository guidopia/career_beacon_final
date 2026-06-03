const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Onboarding = require('../models/Onboarding');
const { authenticateToken } = require('../middleware/auth');

// Save onboarding answers
router.post('/save', authenticateToken, async (req, res) => {
  try {
    console.log('Onboarding save - req.user:', req.user);
    const {
      phoneNumber,
      studentType,
      schoolClass,
      schoolStream,
      collegeYear,
      collegeDegree,
      otherDegree,
      strongestAreas,
      learningFormats,
      motivation,
      futureExcitement,
      strengths,
      careerGoals,
      industries,
      lifestyle,
      learningPreference,
      joiningReason,
      otherReason
    } = req.body;

    // Create onboarding document
    const onboarding = new Onboarding({
      user: req.user._id,
      phoneNumber,
      studentType,
      schoolClass,
      schoolStream,
      collegeYear,
      collegeDegree,
      otherDegree,
      strongestAreas,
      learningFormats,
      motivation,
      futureExcitement,
      strengths,
      careerGoals,
      industries,
      lifestyle,
      learningPreference,
      joiningReason,
      otherReason
    });

    await onboarding.save();

    // Update user's onboarding status and reference
    await User.findByIdAndUpdate(req.user._id, {
      onboardingComplete: true,
      onboarding: onboarding._id, // Set the onboarding reference
      // Keep phone in the User document as well (used across the app)
      ...(phoneNumber ? { phone: String(phoneNumber).trim() } : {})
    });

    res.json({ 
      success: true, 
      message: 'Onboarding completed successfully',
      data: onboarding 
    });

  } catch (error) {
    console.error('Onboarding save error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error saving onboarding data',
      error: error.message 
    });
  }
});

// Get onboarding status
router.get('/status', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ 
      onboardingComplete: user.onboardingComplete 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error checking onboarding status',
      error: error.message 
    });
  }
});

// Get onboarding data
router.get('/data', authenticateToken, async (req, res) => {
  try {
    const onboarding = await Onboarding.findOne({ user: req.user._id });
    if (!onboarding) {
      return res.status(404).json({ 
        success: false, 
        message: 'No onboarding data found' 
      });
    }
    res.json({ 
      success: true, 
      data: onboarding 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching onboarding data',
      error: error.message 
    });
  }
});

module.exports = router;
