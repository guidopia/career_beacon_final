module.exports = function requirePlatformAccess(req, res, next) {
  // `authenticateToken` must run before this middleware.
  const user = req.user;

  if (!user) {
    return res.status(401).json({
      authenticated: false,
      message: 'Authentication required',
    });
  }

  if (user.hasPlatformAccess !== true) {
    return res.status(403).json({
      code: 'PLATFORM_ACCESS_REQUIRED',
      message: 'Your request is under review. Access will be activated after admin approval.',
    });
  }

  next();
};

