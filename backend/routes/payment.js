const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.post("/orders", async (req, res) => {
  const options = {
    amount: req.body.amount * 100, // in paise (₹100 = 10000 paise)
    currency: "INR",
    receipt: "receipt#1",
  };
  try {
    const order = await razorpay.orders.create(options);
    res.status(200).json({ success: true, order });
  } catch (err) {
    res.status(500).send("Error creating Razorpay order");
  }
});
 
