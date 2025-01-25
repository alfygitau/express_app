const jwt = require("jsonwebtoken");

// Secret keys (should be in your environment variables)
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

// Generate JWT tokens (Access + Refresh)
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { userId: user._id, role: user.role },
    ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" } // Access token expiration time (15 minutes)
  );

  const refreshToken = jwt.sign(
    { userId: user._id, role: user.role },
    REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" } // Refresh token expiration time (7 days)
  );

  return { accessToken, refreshToken };
};

module.exports = generateTokens;
