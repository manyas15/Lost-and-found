const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

function attachUser(req, res, next) {
  const token = req.cookies && req.cookies.token;
  if (!token) {
    req.user = null;
    res.locals.currentUser = null;
    return next();
  }

  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) {
      req.user = null;
      res.locals.currentUser = null;
      return next();
    }
    req.user = payload;
    res.locals.currentUser = payload;
    next();
  });
}

function requireAuth(req, res, next) {
  if (!req.user) {
    const nextParam = encodeURIComponent(req.originalUrl || '/');
    return res.redirect(`/auth/login?next=${nextParam}`);
  }
  next();
}

module.exports = {
  attachUser,
  requireAuth,
  JWT_SECRET
};

