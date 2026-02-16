const jwt = require('jsonwebtoken');

function createAuthenticationToken(user) {
  const payload = {
    userId: user._id,
    username: user.username,
    role: user.role || 'user'
  };

  const token = jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );

  return token;
}

module.exports = createAuthenticationToken;