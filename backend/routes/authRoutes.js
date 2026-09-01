const express = require("express");
const {
  register,
  login,
  sellerLogin,
  getCurrentUser,
  logout,
} = require("../controllers/authController");

const router = express.Router();

// Customer auth
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/current-user", getCurrentUser);

// Seller auth (single fixed account, credentials live in Render env vars)
router.post("/seller/login", sellerLogin);
router.post("/seller/logout", logout);
router.get("/current-seller", getCurrentUser);

module.exports = router;
