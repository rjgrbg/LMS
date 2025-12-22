const requireAuth = (req, res, next) => {
  if (!req.session.user_id) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  next();
};

const requireAdmin = (req, res, next) => {
  if (!req.session.user_id || req.session.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }
  next();
};

module.exports = { requireAuth, requireAdmin };
