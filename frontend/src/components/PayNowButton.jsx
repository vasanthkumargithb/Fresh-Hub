import React from "react";
import { handlePayment } from "../utils/handlePayment";

const PayNowButton = () => {
  const handleClick = () => {
    const amount = 50000; // ₹500.00 = 50000 paise

    const userData = {
      name: "Vasanth",
      email: "vasu@example.com",
      contact: "9876543210",
    };

    const productIds = ["64ec9c1234567890abcdef12", "64ec9d1234567890abcdef34"]; // real Mongo IDs

    handlePayment(amount, userData, productIds);
  };

  return (
    <button
      onClick={handleClick}
      style={{
        padding: "10px 20px",
        backgroundColor: "#00b894",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
      }}
    >
      Pay ₹500
    </button>
  );
};

export default PayNowButton;
