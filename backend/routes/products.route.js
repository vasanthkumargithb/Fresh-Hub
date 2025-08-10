import express from "express";
import { createProduct, deleteProduct, getProduct, updateProduct } from "../controllers/product.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Get all products
router.get("/", verifyToken, getProduct);

// Create new product
router.post("/", verifyToken, createProduct);

// Update product by ID
router.put("/:id", verifyToken, updateProduct);

// Delete product by ID
router.delete("/:id", verifyToken, deleteProduct);

// Payment route (commented out)
// router.route("/payment/process").post(processpayment)

export default router;