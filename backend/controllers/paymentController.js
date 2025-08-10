import Razorpay from "razorpay";
import PaymentRecord from "../models/PaymentRecord.js";

// Step 2: Razorpay setup
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ Log the keys to verify .env is loaded correctly
console.log("RAZORPAY_KEY_ID:", process.env.RAZORPAY_KEY_ID);
console.log("RAZORPAY_KEY_SECRET:", process.env.RAZORPAY_KEY_SECRET);

// Step 3: Function to create Razorpay order
export const createOrder = async (req, res) => {
  try {
    const options = {
      amount: req.body.amount, // Amount in paise (₹500 = 50000)
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    // ✅ Only send the order object, not wrapped inside another object
    res.status(200).json(order);
  } catch (error) {
    console.error("Razorpay Order Error:", error);
    res.status(500).json({ success: false, message: "Failed to create order" });
  }
};

// Step 4: Function to record payment after success
export const recordPayment = async (req, res) => {
  try {
    const {
      userId,
      productIds,
      name,
      contact,
      email,
      address,
      pinCode,
      city,
      district,
      state,
      paymentId,
    } = req.body;

    const newRecord = new PaymentRecord({
      userId,
      productIds,
      name,
      contact,
      email,
      address,
      pinCode,
      city,
      district,
      state,
      paymentId,
    });

    await newRecord.save();

    res.status(201).json({ success: true, message: "Payment record saved." });
  } catch (err) {
    console.error("Error saving payment record:", err);
    res.status(500).json({ success: false, message: "Failed to save payment record." });
  }
};
