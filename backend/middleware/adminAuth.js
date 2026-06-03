module.exports = function adminAuth(req, res, next) {
  const adminKey = req.headers['x-admin-key'] || req.query.adminKey;
  if (!process.env.ADMIN_KEY) {
    return res.status(500).json({ error: 'ADMIN_KEY not configured on server' });
  }
  if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};


