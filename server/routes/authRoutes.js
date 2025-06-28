const express = require("express");
const router = express.Router();
const User = require("../models/User");
const verifyFirebaseToken = require("../middleware/authMiddleware");

// Get or create user
router.post("/loginOrSignUp", verifyFirebaseToken, async (req, res) => {
  const { uid, email, name, picture } = req.user;

  try {
    let user = await User.findOne({ firebaseUID: uid });
    if (!user) {
      user = await User.create({
        firebaseUID: uid,
        email,
        name,
        photoURL: picture,
      });
    }
    res.json(user);
  } catch (err) {
    console.error("User auth error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;