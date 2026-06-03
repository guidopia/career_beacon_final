const Purchase = require('../models/Purchase');
const PrepaidAccess = require('../models/PrepaidAccess');

const checkModuleAccess = (module) => async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    const userId = req.user._id;
    
    // Check if user already has access via Purchase
    let purchase = await Purchase.findOne({
      user: userId,
      $or: [
        { module: module },
        { module: 'all-modules' }
      ],
      status: 'completed'
    });

    if (!purchase) {
      console.log(`🔍 No existing purchase found for user ${req.user.email}, checking prepaid access...`);
      
      // FIXED: Combine both $or conditions properly
      const prepaid = await PrepaidAccess.findOne({
        redeemed: false,
        $and: [
          {
            $or: [
              { email: req.user.email?.toLowerCase()?.trim() },
              { phone: req.user.phone }
            ]
          },
          {
            $or: [
              { module: module },
              { module: 'all-modules' }
            ]
          }
        ]
      });

      console.log(`🔍 Prepaid lookup for email: ${req.user.email}, phone: ${req.user.phone}`);
      console.log(`🔍 Prepaid result:`, prepaid ? 'FOUND' : 'NOT FOUND');

      if (prepaid) {
        console.log(`✅ Found prepaid access for ${req.user.email}, creating purchase...`);
        
        const phone = req.user.phone || prepaid.phone || '';
        const expiresAt = prepaid.expiresAt || new Date(new Date().setFullYear(new Date().getFullYear() + 1));
        
        // Create the purchase record
        purchase = await Purchase.create({
          user: req.user._id,
          module: prepaid.module,
          amount: 0,
          paymentId: `admin-grant:${prepaid._id}`,
          orderId: `admin-grant:${prepaid._id}`,
          phone,
          status: 'completed',
          expiresAt
        });

        // Mark prepaid as redeemed
        prepaid.redeemed = true;
        prepaid.redeemedAt = new Date();
        prepaid.redeemedByUser = req.user._id;
        await prepaid.save();

        console.log(`🎉 Successfully redeemed prepaid access for ${req.user.email}`);
      } else {
        console.log(`❌ No prepaid access found for ${req.user.email} / ${req.user.phone}`);
      }
    }

    if (!purchase) {
      return res.status(403).json({ 
        error: 'Access denied. Please purchase this module first.',
        debug: {
          userEmail: req.user.email,
          userPhone: req.user.phone,
          requestedModule: module
        }
      });
    }

    console.log(`✅ Access granted for ${req.user.email} to module: ${module}`);
    next();
  } catch (error) {
    console.error('Error checking module access:', error);
    res.status(500).json({ error: 'Failed to verify access' });
  }
};

module.exports = checkModuleAccess;