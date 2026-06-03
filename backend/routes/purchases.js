const express = require('express');
const router = express.Router();
const Purchase = require('../models/Purchase');
const { authenticateToken } = require('../middleware/auth');

// Check if user has access to a module
router.post('/check-access', authenticateToken, async (req, res) => {
  try {
    // Manual approval gate: regardless of purchase state, deny until admin approves.
    // Dev convenience: allow bypassing paid access checks locally without touching prod behavior.
    if (process.env.NODE_ENV !== 'production' && process.env.BYPASS_ACCESS_CHECK === 'true') {
      return res.json({ hasAccess: true, expiresAt: null, accessSource: 'dev_bypass' });
    }

    if (req.user?.hasPlatformAccess !== true) {
      return res.json({
        hasAccess: false,
        expiresAt: null,
        accessPending: true,
        message: 'Your access request has been received. Access will be granted soon by the admin.',
      });
    }

    // Admin-approved platform access: full premium use without requiring a Purchase row.
    const { userId } = req.body;
    if (userId && String(userId) !== String(req.user._id)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const purchase = await Purchase.findOne({
      user: req.user._id,
      status: 'completed',
      expiresAt: { $gt: new Date() },
    });

    return res.json({
      hasAccess: true,
      expiresAt: purchase ? purchase.expiresAt : null,
      accessSource: purchase ? 'purchase' : 'platform',
    });
  } catch (error) {
    console.error('Error in check-access:', error);
    res.status(500).json({ error: 'Failed to check access' });
  }
});

// Get user's purchased modules
router.get('/my-purchases/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(401).json({ error: 'User ID required' });
    }

    if (String(userId) !== String(req.user._id)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const purchases = await Purchase.find({
      user: userId,
      status: 'completed'
    });

    res.json({ purchases });
  } catch (error) {
    console.error('Error fetching purchases:', error);
    res.status(500).json({ error: 'Failed to fetch purchases' });
  }
});

// Create a new purchase
router.post('/create', authenticateToken, async (req, res) => {
  try {
    const { userId, module, amount, paymentId, orderId } = req.body;
    console.log('Creating purchase:', { userId, module, amount }); // Debug log

    if (!userId || !module || !amount || !paymentId || !orderId) {
      console.log('Missing required fields'); // Debug log
      return res.status(400).json({ error: 'All fields are required' });
    }

    const purchase = new Purchase({
      user: userId,
      module,
      amount,
      paymentId,
      orderId,
      status: 'completed'
    });

    await purchase.save();
    console.log('Purchase created:', purchase); // Debug log
    res.status(201).json({ purchase });
  } catch (error) {
    console.error('Error in create purchase:', error);
    res.status(500).json({ error: 'Failed to create purchase' });
  }
});

// Add route to get user's active subscriptions
router.get('/active-subscriptions/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    if (String(userId) !== String(req.user._id)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    const activePurchases = await Purchase.find({
      user: userId,
      status: 'completed',
      expiresAt: { $gt: new Date() }
    });

    res.json({ 
      subscriptions: activePurchases.map(purchase => ({
        module: purchase.module,
        expiresAt: purchase.expiresAt,
        daysRemaining: Math.ceil((purchase.expiresAt - new Date()) / (1000 * 60 * 60 * 24))
      }))
    });
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    res.status(500).json({ error: 'Failed to fetch subscriptions' });
  }
});

module.exports = router; 