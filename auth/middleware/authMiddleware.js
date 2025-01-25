const jwt = require("jsonwebtoken");

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", ""); // Get token from Authorization header

  if (!token) {
    return res.status(401).json({ error: "Access Denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    req.user = decoded; // Attach user data to the request
    next();
  } catch (error) {
    console.error(error);
    return res.status(403).json({ error: "Invalid or expired access token" });
  }
};

module.exports = { authenticateToken };
