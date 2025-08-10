import React from "react";
import { useLocation } from "react-router-dom";

export default function PaymentSuccess() {
  const query = new URLSearchParams(useLocation().search);
  const paymentId = query.get("razorpay_payment_id");
  const status = query.get("status");

  return (
    <div style={{ maxWidth: 500, margin: "auto", padding: "20px", textAlign: "center" }}>
      <h2>Payment Status</h2>
      {status === "success" ? (
        <>
          <p style={{ color: "green" }}>✅ Payment Successful!</p>
          <p><strong>Payment ID:</strong> {paymentId}</p>
        </>
      ) : (
        <p style={{ color: "red" }}>❌ Payment Failed or Cancelled.</p>
      )}
    </div>
  );
}
