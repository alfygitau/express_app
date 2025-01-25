const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../users/User");
const generateTokens = require("../auth/utils/generateToken");

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ error: "User with such credentials not found" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Send the tokens back to the client
    res.status(200).json({
      message: "Login successful",
      user,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/access_token", (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ error: "Refresh token is required" });
  }

  // Verify the refresh token
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Invalid refresh token" });
    }

    // Create a new access token using the decoded information from the refresh token
    const { accessToken } = generateTokens({
      _id: decoded.userId,
      role: decoded.role,
    });

    // Return the new access token
    res.status(200).json({ accessToken });
  });
});

module.exports = router;
