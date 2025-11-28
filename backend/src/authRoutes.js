// backend/src/authRoutes.js
import express from "express";
import jwt from "jsonwebtoken";
import { users } from "./users.js";

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";

// POST /api/auth/login
router.post("/login", (req, res) => {
  const { email, password, deviceType } = req.body;

  console.log("Login attempt:", { email, deviceType });

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = users.find(
    (u) =>
      u.email.toLowerCase() === email.toLowerCase() &&
      u.password === password
  );

  if (!user) {
    console.log("Invalid credentials for:", email);
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    {
      sub: user.id,
      role: user.role,
      deviceType: deviceType || "unknown",
    },
    JWT_SECRET,
    { expiresIn: "8h" }
  );

  console.log("Login success for:", email);

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

// GET /api/auth/me
router.get("/me", (req, res) => {
  const authHeader = req.headers.authorization || "";

  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing token" });
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = users.find((u) => u.id === decoded.sub);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    console.error("Token verify error:", err.message);
    res.status(401).json({ message: "Invalid token" });
  }
});

export default router;
