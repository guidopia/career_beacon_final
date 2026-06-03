const express = require('express');
const multer = require('multer');
const { parse } = require('csv-parse/sync');
const PrepaidAccess = require('../models/PrepaidAccess');
const User = require('../models/User');
const Purchase = require('../models/Purchase');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Helper function to validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return email && emailRegex.test(email);
};

// Helper function to get default expiration date (1 year from now)
const getDefaultExpiration = () => {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 1);
  return date;
};

// Helper function to generate auto note
const generateAutoNote = () => {
  return `Bulk upload on ${new Date().toISOString().split('T')[0]}`;
};

router.post('/prepaid/upload', adminAuth, upload.single('file'), async (req, res) => {
  try {
    console.log('Upload request received:', { 
      hasFile: !!req.file, 
      fileSize: req.file?.size,
      fileName: req.file?.originalname 
    });
    
    if (!req.file) {
      return res.status(400).json({ error: 'CSV file is required (field name: file)' });
    }

    const csv = req.file.buffer.toString('utf-8');
    console.log('CSV content preview:', csv.substring(0, 200));
    
    const records = parse(csv, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      relaxColumnCount: true // Allow missing columns
    });

    console.log('Parsed records count:', records.length);
    console.log('First record:', records[0]);

    if (!Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ error: 'CSV has no valid rows' });
    }

    // Check if required email column exists
    const firstRecord = records[0];
    if (!firstRecord.hasOwnProperty('email')) {
      return res.status(400).json({ 
        error: 'CSV must have an "email" column. Found columns: ' + Object.keys(firstRecord).join(', ')
      });
    }

    const results = { 
      created: 0, 
      updated: 0, 
      skipped: 0, 
      errors: [],
      processed: 0,
      duplicates: 0
    };

    for (let i = 0; i < records.length; i++) {
      const row = records[i];
      results.processed++;
      
      try {
        // Extract and validate email (required)
        const email = (row.email || '').toLowerCase().trim();
        
        if (!email) {
          results.skipped++;
          results.errors.push(`Row ${i + 1}: Email is required`);
          continue;
        }

        if (!isValidEmail(email)) {
          results.skipped++;
          results.errors.push(`Row ${i + 1}: Invalid email format: ${email}`);
          continue;
        }

        // Extract optional fields with defaults
        const phone = (row.phone || '').trim();
        const module = (row.module || 'all-modules').trim();
        const note = row.note ? String(row.note).trim() : generateAutoNote();
        
        // Handle expiration date
        let expiresAt = getDefaultExpiration();
        if (row.expiresAt) {
          const d = new Date(row.expiresAt);
          if (!isNaN(d.getTime())) {
            expiresAt = d;
          } else {
            console.log(`Row ${i + 1}: Invalid date format for expiresAt, using default`);
          }
        }

        // Validate module if provided
        const validModules = ['all-modules', 'sanskriti', 'upskilling', 'career-assessment', 'school-assessment'];
        if (module && !validModules.includes(module)) {
          results.skipped++;
          results.errors.push(`Row ${i + 1}: Invalid module "${module}". Valid modules: ${validModules.join(', ')}`);
          continue;
        }

        // Check for existing entry
        const query = {
          email,
          module,
          redeemed: false
        };

        const existing = await PrepaidAccess.findOne(query);
        
        if (existing) {
          // Update existing entry
          let updated = false;
          
          if (phone && phone !== existing.phone) {
            existing.phone = phone;
            updated = true;
          }
          
          if (note !== existing.note) {
            existing.note = note;
            updated = true;
          }
          
          if (expiresAt.getTime() !== existing.expiresAt?.getTime()) {
            existing.expiresAt = expiresAt;
            updated = true;
          }
          
          if (updated) {
            existing.updatedAt = new Date();
            await existing.save();
            results.updated++;
          } else {
            results.duplicates++;
          }
        } else {
          // Create new entry
          await PrepaidAccess.create({ 
            email, 
            phone: phone || undefined, // Don't store empty strings
            module, 
            note, 
            expiresAt,
            createdAt: new Date()
          });
          results.created++;
        }

      } catch (e) {
        console.error(`Error processing row ${i + 1}:`, e);
        results.errors.push(`Row ${i + 1}: ${e.message}`);
      }
    }

    console.log('Upload results:', results);

    return res.json({ 
      success: true, 
      message: `Processed ${results.processed} rows. Created: ${results.created}, Updated: ${results.updated}, Skipped: ${results.skipped}, Duplicates: ${results.duplicates}`,
      ...results 
    });

  } catch (error) {
    console.error('Bulk prepaid upload error:', error);
    return res.status(500).json({ 
      error: 'Failed to upload CSV: ' + error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Enhanced redeem endpoint with better logging and error handling
router.post('/prepaid/redeem-now', adminAuth, async (req, res) => {
  try {
    const { module } = req.body || {};
    console.log('Redeem request for module:', module || 'all');
    
    const filter = { redeemed: false };
    if (module && module !== '') {
      filter.module = module;
    }

    const prepaids = await PrepaidAccess.find(filter);
    console.log(`Found ${prepaids.length} unredeemed prepaid entries`);

    let redeemedCount = 0;
    let notFoundUsers = 0;
    let errors = [];

    for (const p of prepaids) {
      try {
        console.log(`Processing prepaid entry for email: "${p.email}", phone: "${p.phone}"`);
        
        // Look for user - prioritize email matching since phone numbers are not unique (all are 111111111)
        let user = null;

        // Always try email first (more reliable for unique identification)
        if (p.email) {
          user = await User.findOne({ email: p.email.toLowerCase().trim() });
          console.log(`Email lookup for ${p.email}: ${user ? 'FOUND' : 'NOT FOUND'}`);
        }

        // Only fall back to phone if no email match AND phone is not the placeholder
        if (!user && p.phone && p.phone !== '111111111') {
          user = await User.findOne({ phone: p.phone.trim() });
          console.log(`Phone lookup for ${p.phone}: ${user ? 'FOUND' : 'NOT FOUND'}`);
        }
        
        if (!user) {
          notFoundUsers++;
          console.log(`User not found for email: ${p.email}, phone: ${p.phone}`);
          continue;
        }

        console.log(`Found user: ${user.email} (ID: ${user._id})`);

        // Check if user already has this module
        const existingPurchase = await Purchase.findOne({
          user: user._id,
          module: p.module,
          status: 'completed'
        });

        if (existingPurchase) {
          console.log(`User ${user.email} already has module ${p.module}, skipping`);
          continue;
        }

        const phone = user.phone || p.phone || '';
        const expiresAt = p.expiresAt || getDefaultExpiration();

        // Create purchase record
        await Purchase.create({
          user: user._id,
          module: p.module,
          amount: 0,
          paymentId: `admin-grant:${p._id}`,
          orderId: `admin-grant:${p._id}`,
          phone,
          status: 'completed',
          expiresAt,
          createdAt: new Date()
        });

        // Mark prepaid as redeemed
        p.redeemed = true;
        p.redeemedAt = new Date();
        p.redeemedByUser = user._id;
        await p.save();
        
        redeemedCount++;
        console.log(`Successfully redeemed ${p.module} for user ${user.email}`);

      } catch (e) {
        console.error(`Error redeeming for prepaid ${p._id}:`, e);
        errors.push(`Error redeeming ${p.email}: ${e.message}`);
      }
    }

    const result = {
      success: true,
      totalFound: prepaids.length,
      redeemed: redeemedCount,
      usersNotFound: notFoundUsers,
      errors: errors.length > 0 ? errors : undefined,
      message: `Successfully redeemed ${redeemedCount} out of ${prepaids.length} entries. ${notFoundUsers} users not found in system.`
    };

    console.log('Redeem results:', result);
    return res.json(result);

  } catch (error) {
    console.error('Redeem-now error:', error);
    return res.status(500).json({ 
      error: 'Failed to redeem: ' + error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// New endpoint to get prepaid statistics
router.get('/prepaid/stats', adminAuth, async (req, res) => {
  try {
    const totalPrepaid = await PrepaidAccess.countDocuments();
    const redeemed = await PrepaidAccess.countDocuments({ redeemed: true });
    const unredeemed = await PrepaidAccess.countDocuments({ redeemed: false });
    
    // Get module breakdown
    const moduleStats = await PrepaidAccess.aggregate([
      {
        $group: {
          _id: '$module',
          total: { $sum: 1 },
          redeemed: { $sum: { $cond: ['$redeemed', 1, 0] } },
          unredeemed: { $sum: { $cond: ['$redeemed', 0, 1] } }
        }
      }
    ]);

    return res.json({
      success: true,
      stats: {
        total: totalPrepaid,
        redeemed,
        unredeemed,
        moduleBreakdown: moduleStats
      }
    });

  } catch (error) {
    console.error('Stats error:', error);
    return res.status(500).json({ error: 'Failed to get stats' });
  }
});

// ---- Admin platform-access grant/revoke ----
//
// Replaces the legacy "counselling approval" workflow. Admins now grant or
// revoke premium access directly on the user; there is no booking flow.

router.post('/users/:userId/grant-access', adminAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndUpdate(
      userId,
      { hasPlatformAccess: true },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json({ success: true, userId: String(user._id), hasPlatformAccess: true });
  } catch (error) {
    console.error('Grant access error:', error);
    return res.status(500).json({ error: 'Failed to grant access' });
  }
});

router.post('/users/:userId/revoke-access', adminAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndUpdate(
      userId,
      { hasPlatformAccess: false },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json({ success: true, userId: String(user._id), hasPlatformAccess: false });
  } catch (error) {
    console.error('Revoke access error:', error);
    return res.status(500).json({ error: 'Failed to revoke access' });
  }
});

module.exports = router;