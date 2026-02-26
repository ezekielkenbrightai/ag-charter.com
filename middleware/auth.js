/**
 * Authentication & Authorization Middleware
 *
 * requireAuth  — Ensures the request has a valid session with a logged-in user.
 * requireTier  — Ensures the user's tier_level is ≤ the specified maximum.
 *                (Lower tier number = higher privilege: Tier 1 > Tier 7)
 */

function requireAuth(req, res, next) {
  if (!req.session || !req.session.user) {
    // API requests get JSON; page requests get redirected
    if (req.path.startsWith('/api/')) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    return res.redirect('/login.html');
  }
  // Attach user to request for downstream use
  req.user = req.session.user;
  next();
}

/**
 * Factory: returns middleware that checks tier_level ≤ maxTier.
 * Example: requireTier(2) allows Tier 1 and 2 only.
 */
function requireTier(maxTier) {
  return function (req, res, next) {
    if (!req.session || !req.session.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    if (req.session.user.tier_level > maxTier) {
      return res.status(403).json({
        error: 'Insufficient access',
        required_tier: maxTier,
        your_tier: req.session.user.tier_level
      });
    }
    req.user = req.session.user;
    next();
  };
}

module.exports = { requireAuth, requireTier };
