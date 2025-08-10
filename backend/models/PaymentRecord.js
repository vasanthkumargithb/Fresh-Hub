import mongoose from "mongoose";

const paymentRecordSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  productIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  }],
  name: String,
  contact: String,
  email: String,
  address: String,
  pinCode: String,
  city: String,
  district: String,
  state: String,
  paymentId: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const PaymentRecord = mongoose.model("PaymentRecord", paymentRecordSchema);

export default PaymentRecord;
