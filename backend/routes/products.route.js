import express from "express";
import { createProduct, deleteProduct, getProduct, updateProduct } from "../controllers/product.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// ✅ Public route: Get all products (no token required)
router.get("/", getProduct);

// ✅ Protected routes (require token)
router.post("/", verifyToken, createProduct);
router.put("/:id", verifyToken, updateProduct);
router.delete("/:id", verifyToken, deleteProduct);

// Payment route (commented out)
// router.route("/payment/process").post(processpayment)

export default router;
