const express = require("express");
const jwt = require("jsonwebtoken");
const { asyncHandler } = require("../middleware/errorHandler");

const router = express.Router();

// POST /api/admin/login  { password }
router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Password is required." });
    }

    if (password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ message: "Incorrect password." });
    }

    const token = jwt.sign({ role: "admin" }, process.env.ADMIN_JWT_SECRET, {
      expiresIn: process.env.ADMIN_JWT_EXPIRES_IN || "7d",
    });

    res.json({ token });
  })
);

// GET /api/admin/verify — used by the frontend to check if a stored token is still valid
router.get(
  "/verify",
  asyncHandler(async (req, res) => {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ valid: false });

    try {
      jwt.verify(token, process.env.ADMIN_JWT_SECRET);
      return res.json({ valid: true });
    } catch {
      return res.status(401).json({ valid: false });
    }
  })
);

module.exports = router;
