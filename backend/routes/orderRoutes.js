const express = require("express");
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
} = require("../controllers/orderController");
const { requireAuth, requireSeller } = require("../middleware/auth");

const router = express.Router();

router.post("/", requireAuth, createOrder);
router.get("/", requireAuth, getOrders);
router.get("/:id", requireAuth, getOrderById);
router.put("/:id/status", requireAuth, requireSeller, updateOrderStatus);

module.exports = router;
