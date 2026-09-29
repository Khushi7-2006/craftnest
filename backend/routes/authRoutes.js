const express = require("express");

const {
  register,
  login,
  sellerLogin,
  getCurrentUser,
  logout,
  getSellerSettings,
  updateSellerSettings,
} = require("../controllers/authController");

const { requireAuth, requireSeller } = require("../middleware/auth");

const router = express.Router();

// Customer auth
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/current-user", getCurrentUser);

// Seller auth
router.post("/seller/login", sellerLogin);
router.post("/seller/logout", logout);
router.get("/current-seller", getCurrentUser);

// Seller Account Settings
router.get(
  "/seller/settings",
  requireAuth,
  requireSeller,
  getSellerSettings
);

router.put(
  "/seller/settings",
  requireAuth,
  requireSeller,
  updateSellerSettings
);

module.exports = router;
