const supabase = require('../config/supabase');

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ success: false, error: 'No token provided' });
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ success: false, error: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ success: false, error: 'Authentication failed' });
  }
};

const isDonor = (req, res, next) => {
  if (req.user?.user_metadata?.user_type !== 'donor') {
    return res.status(403).json({ success: false, error: 'Access denied. Donors only.' });
  }
  next();
};

const isOrganization = (req, res, next) => {
  if (req.user?.user_metadata?.user_type !== 'organization') {
    return res.status(403).json({ success: false, error: 'Access denied. Organizations only.' });
  }
  next();
};

module.exports = { authenticate, isDonor, isOrganization };
