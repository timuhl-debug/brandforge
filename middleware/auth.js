const jwt = require('jsonwebtoken');
const User = require('../models/User');
module.exports = async function auth(req, res, next) {
  try {
    const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
    if (!token) return res.status(401).json({ message: 'Bearer token is required.' });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub).select('name email isVerified');
    if (!user) return res.status(401).json({ message: 'Invalid session. Please sign in again.' });
    if (!user.isVerified) return res.status(403).json({ message: 'Please verify your email before continuing.' });
    req.user = user; next();
  } catch { return res.status(401).json({ message: 'Session expired or invalid. Please sign in again.' }); }
};
