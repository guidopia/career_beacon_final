const express = require('express');
const router = express.Router();
const { generateFutureMeCard } = require('../utils/gemini');
const FutureMeCard = require('../models/FutureMeCard');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

// POST /api/futureme/generate
router.post('/generate', authenticateToken, async (req, res) => {

  try {
    const inputData = req.body.onboardingData || req.body.answers || req.body;
    
    if (!inputData) {
      return res.status(400).json({
        success: false,
        error: 'No input data provided'
      });
    }

    // Generate card data using Gemini
    const cardData = await generateFutureMeCard({ onboardingData: inputData });
    
    // Create new FutureMeCard document
    const newCard = await FutureMeCard.create({
      user: req.user._id,
      answers: inputData,
      ...cardData // spread the generated card data
    });

    // Update user document with the new card reference
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { futureMeCard: newCard._id },
      { new: true }
    ).populate({
      path: 'futureMeCard',
      select: 'futureRole tagline tags mindset salary keySkills mentors cta personalityType careerRecommendations skillRecommendations'
    });

    res.json({
      success: true,
      user: updatedUser
    });
  } catch (error) {
    console.error('Generate future me card error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate card'
    });
  }
});

// Save a new card - UPDATED to save detailed fields
router.post('/', authenticateToken, async (req, res) => {

  try {
    const { 
      answers, 
      futureRole, 
      tagline, 
      tags, 
      mindset, 
      salary, 
      keySkills, 
      mentors, 
      cta,
      personalityType, // Include if your Gemini output provides this
      careerRecommendations, // Include if your Gemini output provides this
      skillRecommendations // Include if your Gemini output provides this
    } = req.body;

    // Ensure user is authenticated and userId is available
    const userId = req.user._id;

    // Create the new FutureMeCard document with detailed fields
    const newCard = await FutureMeCard.create({
      user: userId,
      answers, // Keep raw answers if needed
      futureRole,
      tagline,
      tags,
      mindset,
      salary,
      keySkills,
      mentors,
      cta,
      personalityType,
      careerRecommendations,
      skillRecommendations,
    });

    // Optionally, update the User model to reference this new FutureMeCard
    // This is important if you populate 'futureMeCard' field in User in profile route
    await User.findByIdAndUpdate(userId, { futureMeCard: newCard._id });

    res.status(201).json(newCard); // Send back the created card
  } catch (err) {
    console.error('Error saving Future Me card:', err);
    res.status(500).json({ error: 'Failed to save card', details: err.message });
  }
});

// Get latest card for user
router.get('/latest', authenticateToken, async (req, res) => {

  try {
    const user = await User.findById(req.user._id).populate('futureMeCard');
    if (!user.futureMeCard) {
      return res.status(404).json({ error: 'No FutureMeCard found' });
    }
    res.json(user.futureMeCard);
  } catch (err) {
    console.error('Error fetching latest Future Me card:', err);
    res.status(500).json({ error: 'Failed to fetch card' });
  }
});

// Update future me role
router.put('/role', authenticateToken, async (req, res) => {

  try {
    const { futureRole } = req.body;
    
    if (!futureRole) {
      return res.status(400).json({ error: 'Future role is required' });
    }

    // Find user's FutureMeCard and update the role
    const updatedCard = await FutureMeCard.findOneAndUpdate(
      { user: req.user._id },
      { futureRole },
      { new: true }
    );

    if (!updatedCard) {
      return res.status(404).json({ error: 'No FutureMeCard found for user' });
    }

    res.json({ 
      success: true, 
      message: 'Future role updated successfully',
      futureRole: updatedCard.futureRole 
    });
  } catch (err) {
    console.error('Error updating future role:', err);
    res.status(500).json({ error: 'Failed to update future role' });
  }
});

module.exports = router;
