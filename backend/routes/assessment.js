const express = require('express');
const router = express.Router();
const Assessment = require('../models/Assessment');
const User = require('../models/User');
const Onboarding = require('../models/Onboarding');
const { authenticateToken } = require('../middleware/auth');
const requirePlatformAccess = require('../middleware/platformAccess');

// Save assessment answers
router.post('/save', authenticateToken, requirePlatformAccess, async (req, res) => {

  try {
    const { assessmentType, answers } = req.body;
    
    // Get user's phone number from onboarding
    const onboarding = await Onboarding.findOne({ user: req.user._id });
    if (!onboarding) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please complete onboarding first' 
      });
    }

    // Get user's name
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Create assessment document
    const assessment = new Assessment({
      user: req.user._id,
      assessmentType,
      answers: answers.map((answer, index) => ({
        question: `Question ${index + 1}`,
        answer
      })),
      phoneNumber: onboarding.phoneNumber,
      username: user.name
    });

    await assessment.save();

    res.json({ 
      success: true, 
      message: 'Assessment saved successfully',
      data: assessment 
    });

  } catch (error) {
    console.error('Assessment save error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error saving assessment data',
      error: error.message 
    });
  }
});

module.exports = router;
