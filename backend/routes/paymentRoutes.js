import express from "express";
import { createOrder, recordPayment } from "../controllers/paymentController.js";
import PaymentRecord from "../models/PaymentRecord.js";

const router = express.Router();

// ✅ Route to create a Razorpay order
router.post("/create-order", createOrder);

// ✅ NEW: Route to create a Razorpay order (alternative endpoint)
router.post("/orders", createOrder);

// ✅ Route to record payment
router.post("/record", recordPayment);

// ✅ Route to get payment records for a user
router.get("/records/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const records = await PaymentRecord.find({ userId })
      .sort({ createdAt: -1 })
      .populate("userId", "name email")
      .populate("productIds", "name"); // Populate product name from Product model

    res.status(200).json(records);
  } catch (error) {
    console.error("Error fetching payment records:", error);
    res.status(500).json({ message: "Error fetching payment records" });
  }
});

export default router;