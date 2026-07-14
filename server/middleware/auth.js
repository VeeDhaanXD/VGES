const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // Get token from header
  const token = req.header('Authorization');

  // Check if no token
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token, authorization denied' });
  }

  // Verify token
  try {
    // We split because the token usually comes as "Bearer <token_string>"
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.teacher = decoded.teacher;
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: 'Token is not valid' });
  }
};