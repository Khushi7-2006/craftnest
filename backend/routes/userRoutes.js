const express = require("express");
const router = express.Router();

const { getProfile, getAllCustomers } = require("../controllers/userController");
const { requireAuth, requireSeller } = require("../middleware/auth");

router.get("/profile", requireAuth, getProfile);

router.get(
  "/customers",
  requireAuth,
  requireSeller,
  getAllCustomers
);

module.exports = router;
