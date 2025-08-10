import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const handlePayment = async (amount, userData, productIds) => {
  try {
    const { data: order } = await axios.post(`${API}/api/payment/create-order`, { amount });

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Fresh Hub",
      description: "Order Payment",
      order_id: order.id,
      handler: async function (response) {
        const paymentId = response.razorpay_payment_id;

        await axios.post(`${API}/api/payment/record`, {
          ...userData,
          productIds,
          paymentId,
        });

        alert("✅ Payment Successful!");
      },
      prefill: {
        name: userData.name,
        email: userData.email,
        contact: userData.contact,
      },
      theme: {
        color: "#00b894",
      },
    };

    const razor = new window.Razorpay(options);
    razor.open();
  } catch (err) {
    console.error("❌ Payment Error:", err);
    alert("❌ Payment failed");
  }
};
