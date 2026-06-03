const express = require('express');
const User = require('../models/User');
const Onboarding = require('../models/Onboarding');
const FutureMeCard = require('../models/FutureMeCard');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const OnboardingModel = require('../models/Onboarding');

// Onboarding question (POST)
router.post('/onboarding', authenticateToken, async (req, res) => {
      // Save onboarding data
    await User.findByIdAndUpdate(req.user._id, {
      onboardingComplete: true,
      onboarding: req.body.onboardingId,
      // ...other onboarding fields from req.body
    });
  res.json({ success: true });
});

// Get current user (always re-read from DB so admin grant/revoke reflects immediately)
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).lean();
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const payload = { ...user, hasPlatformAccess: user.hasPlatformAccess === true };

    if (!user.phone) {
      const onboarding = await OnboardingModel.findOne({ user: user._id }).lean();
      const phoneNumber = onboarding?.phoneNumber ? String(onboarding.phoneNumber).trim() : '';
      if (phoneNumber) {
        payload.phone = phoneNumber;
      }
    }

    if (process.env.DEBUG_ACCESS === 'true') {
      console.info('[access] GET /api/user/me', {
        userId: String(user._id),
        email: user.email,
        hasPlatformAccess: payload.hasPlatformAccess,
      });
    }

    res.json(payload);
  } catch (e) {
    console.error('Error in /me:', e);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user profile data
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-googleId -onboardingAnswers')
      .populate({
        path: 'onboarding',
        model: 'Onboarding',
        select: 'phoneNumber studentType schoolClass schoolStream strongestAreas learningFormats motivation futureExcitement collegeYear collegeDegree otherDegree strengths careerGoals industries lifestyle learningPreference joiningReason otherReason completedAt'
      })
      .populate({
        path: 'futureMeCard',
        model: 'FutureMeCard',
        select: 'futureRole tagline tags mindset salary keySkills mentors cta personalityType careerRecommendations skillRecommendations'
      });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error', details: error.message });
  }
});

// Update user profile data
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const {
      name,
      age,
      gender,
      about,
      socialLinks,
      experience,
      skillsInProgress,
      completionCertificates,
      personalityType,
      personalityScores,
      careerRecommendations,
      skillRecommendations,
      profilePic
    } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        name,
        age,
        gender,
        about,
        socialLinks,
        experience,
        skillsInProgress,
        completionCertificates,
        personalityType,
        personalityScores,
        careerRecommendations,
        skillRecommendations,
        ...(profilePic !== undefined && { profilePic })
      },
      { new: true, runValidators: true }
    ).select('-googleId -onboardingAnswers');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add activity log entry
router.post('/activity', authenticateToken, async (req, res) => {
  try {
    const { message, timestamp } = req.body;
    if (!message) return res.status(400).json({ message: 'Message is required' });
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $push: { activityLog: { message, timestamp: timestamp ? new Date(timestamp) : new Date() } } },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ success: true });
  } catch (error) {
    console.error('Error logging activity:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
