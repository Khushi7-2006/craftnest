const express = require("express");
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { requireAuth, requireSeller } = require("../middleware/auth");

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", requireAuth, requireSeller, createProduct);
router.put("/:id", requireAuth, requireSeller, updateProduct);
router.delete("/:id", requireAuth, requireSeller, deleteProduct);

module.exports = router;
