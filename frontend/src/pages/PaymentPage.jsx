import { useState, useEffect } from "react";

export default function PaymentPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    amount: "",
  });
  const [loading, setLoading] = useState(false);

  // Debug: Log environment variables
  useEffect(() => {
    console.log("🔑 RAZORPAY KEY FROM ENV:", import.meta.env.VITE_RAZORPAY_KEY_ID);
    console.log("🌍 ALL ENV VARS:", import.meta.env);
    
    // Also check if the key exists
    if (!import.meta.env.VITE_RAZORPAY_KEY_ID) {
      console.error("❌ VITE_RAZORPAY_KEY_ID is not defined!");
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone || !formData.amount) {
      alert("Please fill all fields");
      return;
    }

    // 🔥 HARDCODED KEY - TEMPORARY FIX
    const razorpayKey = "rzp_test_Fg7MWBV0KYlx07";
    console.log("🚀 About to use Razorpay key:", razorpayKey);

    if (!razorpayKey) {
      alert("Razorpay key is not configured. Please check your environment variables.");
      return;
    }

    setLoading(true);
    try {
      // Step 1: Create order from backend
      const response = await fetch("http://localhost:5000/api/payment/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: parseInt(formData.amount) * 100, // Convert to paise
        }),
      });

      const orderData = await response.json();
      console.log("📦 Order created:", orderData);

      if (!response.ok) {
        throw new Error(`Failed to create order: ${response.status}`);
      }

      // Step 2: Initialize Razorpay payment
      const options = {
        key: razorpayKey, // Use the key from environment
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Fresh Hub",
        description: "Payment for fresh farm products",
        order_id: orderData.id,
        handler: async function (response) {
          console.log("✅ Payment successful:", response);
          
          // Step 3: Record payment in backend
          try {
            const recordResponse = await fetch("http://localhost:5000/api/payment/record", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                userId: "temp_user_id", // Replace with actual user ID
                productIds: ["temp_product_id"], // Replace with actual product IDs
                name: formData.name,
                contact: formData.phone,
                email: formData.email,
                address: "Temporary Address", // Add these fields to your form if needed
                pinCode: "000000",
                city: "Bengaluru",
                district: "Bengaluru Urban",
                state: "Karnataka",
                paymentId: response.razorpay_payment_id,
              }),
            });

            if (recordResponse.ok) {
              alert("Payment successful and recorded!");
              // Reset form
              setFormData({
                name: "",
                email: "",
                phone: "",
                amount: "",
              });
            } else {
              console.error("Failed to record payment");
              alert("Payment successful but failed to record. Please contact support.");
            }
          } catch (error) {
            console.error("Error recording payment:", error);
            alert("Payment successful but failed to record. Please contact support.");
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#3399cc",
        },
      };

      console.log("🎯 Razorpay options:", options);
      
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("❌ Payment error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
      <h2>Make a Payment</h2>
      
      {/* Debug Info */}
      <div style={{ 
        background: "#f0f0f0", 
        padding: "10px", 
        marginBottom: "20px", 
        fontSize: "12px",
        borderRadius: "5px"
      }}>
        <strong>🔑 Hardcoded Key:</strong> rzp_test_Fg7MWBV0KYlx07
        <br />
        <strong>🌐 From ENV:</strong> {import.meta.env.VITE_RAZORPAY_KEY_ID || "NOT LOADED"}
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />
        <input
          type="number"
          name="amount"
          placeholder="Amount (₹)"
          value={formData.amount}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />
        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            width: "100%", 
            padding: "12px", 
            backgroundColor: "#3399cc", 
            color: "white", 
            border: "none", 
            borderRadius: "5px",
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>
      </form>
    </div>
  );
}