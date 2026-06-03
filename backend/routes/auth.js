const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');
const { generateToken } = require('../middleware/auth');
const PrepaidAccess = require('../models/PrepaidAccess');
const Purchase = require('../models/Purchase');

function getFrontendUrl() {
  // In local/dev, always redirect back to the local Vite app so Google OAuth
  // doesn't bounce you to production just because FRONTEND_URL is set.
  if (process.env.NODE_ENV !== 'production') {
    return process.env.FRONTEND_URL_DEV || 'http://localhost:5173';
  }
  return process.env.FRONTEND_URL || 'http://localhost:5173';
}

// Debug route to check environment variables
router.get('/debug', (req, res) => {
  res.json({
    hasJwtSecret: !!process.env.JWT_SECRET,
    hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
    hasGoogleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
    googleCallbackUrl: process.env.GOOGLE_CALLBACK_URL,
    frontendUrl: process.env.FRONTEND_URL,
    frontendUrlResolved: getFrontendUrl(),
    nodeEnv: process.env.NODE_ENV
  });
});

// Start Google OAuth
router.get('/google', (req, res, next) => {
  console.log('🚀 Google OAuth start - redirecting to Google...');
  console.log('Google OAuth - clientID exists:', !!process.env.GOOGLE_CLIENT_ID);
  console.log('Google OAuth - clientSecret exists:', !!process.env.GOOGLE_CLIENT_SECRET);
  console.log('Google OAuth - callbackURL:', process.env.GOOGLE_CALLBACK_URL);
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

// Google OAuth callback with enhanced debugging
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  async (req, res) => {
    console.log('\n=== GOOGLE OAUTH CALLBACK START ===');
    console.log('Request URL:', req.url);
    console.log('Request query:', req.query);
    console.log('req.user exists:', !!req.user);
    
    if (req.user) {
      console.log('User data:', {
        id: req.user._id,
        email: req.user.email,
        name: req.user.name,
        googleId: req.user.googleId
      });
    }

    if (!req.user) {
      console.log('❌ No user found after Google login!');
      const FRONTEND_URL = getFrontendUrl();
      const redirectUrl = `${FRONTEND_URL}/login?error=auth_failed`;
      console.log('Redirecting to:', redirectUrl);
      return res.redirect(redirectUrl);
    }

    try {
      // Generate JWT token
      console.log('🔑 Generating JWT token for user:', req.user._id);
      const token = generateToken(req.user._id);
      console.log('Token generated successfully. Length:', token.length);
      
      // Get full user data
      const user = await User.findById(req.user._id);
      console.log('User found in DB:', !!user);
      console.log('User onboarding complete:', user?.onboardingComplete);
      
      const FRONTEND_URL = getFrontendUrl();
      console.log('Using FRONTEND_URL:', FRONTEND_URL);
      
      // Redeem any prepaid access on first login
      try {
        const matchingPrepaids = await PrepaidAccess.find({
          redeemed: false,
          $or: [
            { email: user.email },
            { phone: user.phone }
          ]
        });
        for (const p of matchingPrepaids) {
          const expiresAt = p.expiresAt || new Date(new Date().setFullYear(new Date().getFullYear() + 1));
          await Purchase.create({
            user: user._id,
            module: p.module,
            amount: 0,
            paymentId: `admin-grant:${p._id}`,
            orderId: `admin-grant:${p._id}`,
            phone: user.phone || p.phone || '',
            status: 'completed',
            expiresAt
          });
          p.redeemed = true;
          p.redeemedAt = new Date();
          p.redeemedByUser = user._id;
          await p.save();
        }
      } catch (e) {
        console.error('Prepaid redemption on login failed:', e.message);
      }

      let redirectUrl;
      if (!user.onboardingComplete) {
        redirectUrl = `${FRONTEND_URL}/onboarding?token=${token}`;
        console.log('🔄 Redirecting to onboarding');
      } else {
        redirectUrl = `${FRONTEND_URL}/dashboard?token=${token}`;
        console.log('🔄 Redirecting to dashboard');
      }
      
      console.log('Final redirect URL:', redirectUrl);
      console.log('=== GOOGLE OAUTH CALLBACK END ===\n');
      
      return res.redirect(redirectUrl);
    } catch (error) {
      console.error('❌ Error in OAuth callback:', error);
      const FRONTEND_URL = getFrontendUrl();
      const redirectUrl = `${FRONTEND_URL}/login?error=callback_error`;
      console.log('Error redirect URL:', redirectUrl);
      return res.redirect(redirectUrl);
    }
  }
);

// Enhanced session check endpoint
router.get('/session', async (req, res) => {
  console.log('\n=== SESSION CHECK START ===');
  console.log('Authorization header:', req.headers.authorization);
  
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      console.log('❌ No authorization header');
      return res.status(401).json({ 
        authenticated: false, 
        message: 'No authorization header' 
      });
    }

    const token = authHeader.split(' ')[1];
    console.log('Token extracted:', !!token, 'Length:', token?.length);
    
    if (!token) {
      console.log('❌ No token in authorization header');
      return res.status(401).json({ 
        authenticated: false, 
        message: 'No token provided' 
      });
    }

    console.log('🔍 Verifying JWT token...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decoded successfully. User ID:', decoded.userId);
    
    // Find the user to return full user data
    const user = await User.findById(decoded.userId);
    console.log('User found in DB:', !!user);
    
    if (!user) {
      console.log('❌ User not found in database');
      return res.status(401).json({ 
        authenticated: false, 
        message: 'User not found' 
      });
    }

    console.log('✅ Session check successful for user:', user.email);
    console.log('=== SESSION CHECK END ===\n');

    res.json({ 
      authenticated: true, 
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        googleId: user.googleId,
        onboardingComplete: user.onboardingComplete
      }
    });
  } catch (error) {
    console.error('❌ Session check error:', error.message);
    console.log('=== SESSION CHECK END (ERROR) ===\n');
    res.status(401).json({ 
      authenticated: false, 
      message: 'Invalid or expired token',
      error: error.message 
    });
  }
});

// Debug test endpoint to simulate successful OAuth
router.get('/test-callback', async (req, res) => {
  console.log('🧪 Test callback endpoint hit');
  
  try {
    // Find or create a test user
    let user = await User.findOne({ email: 'test@example.com' });
    
    if (!user) {
      user = await User.create({
        googleId: 'test-google-id',
        email: 'test@example.com',
        name: 'Test User',
        onboardingComplete: false
      });
      console.log('Created test user:', user._id);
    } else {
      console.log('Found existing test user:', user._id);
    }
    
    // Generate token
    const token = generateToken(user._id);
    console.log('Generated test token, length:', token.length);
    
    const FRONTEND_URL = getFrontendUrl();
    const redirectUrl = `${FRONTEND_URL}/onboarding?token=${token}`;
    
    console.log('Test redirect URL:', redirectUrl);
    
    res.redirect(redirectUrl);
  } catch (error) {
    console.error('Test callback error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Logout routes
router.get('/logout', (req, res) => {
  res.json({ message: 'Logout successful' });
});

router.post('/logout', (req, res) => {
  res.status(200).json({ message: 'Logout successful' });
});

module.exports = router;
