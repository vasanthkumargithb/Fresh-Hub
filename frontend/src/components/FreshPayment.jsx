import { useState, useEffect } from "react";

// 🔥 NUCLEAR ANTI-CACHE VERSION
export default function FreshPaymentComponent() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    amount: "",
  });
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState("");

  useEffect(() => {
    // Force reload Razorpay script
    const existingScript = document.querySelector('script[src*="checkout.razorpay.com"]');
    if (existingScript) {
      existingScript.remove();
    }
    
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js?t=' + Date.now();
    script.async = true;
    document.head.appendChild(script);
    
    setDebugInfo(`Loaded at: ${new Date().toLocaleTimeString()}`);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone || !formData.amount) {
      alert("Please fill all fields");
      return;
    }

    // 🚀 HARDCODED CORRECT KEY - NO ENVIRONMENT VARIABLES
    const RAZORPAY_KEY = "rzp_test_Fg7MWBV0KYlx07";
    
    console.log("=".repeat(50));
    console.log("🔑 USING KEY:", RAZORPAY_KEY);
    console.log("=".repeat(50));

    setLoading(true);
    
    try {
      // Step 1: Create order
      console.log("📦 Creating order...");
      const orderResponse = await fetch("http://localhost:5000/api/payment/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: parseInt(formData.amount) * 100,
        }),
      });

      if (!orderResponse.ok) {
        throw new Error(`Order creation failed: ${orderResponse.status}`);
      }

      const orderData = await orderResponse.json();
      console.log("✅ Order created:", orderData);

      // Step 2: Initialize Razorpay with fresh instance
      const paymentOptions = {
        key: RAZORPAY_KEY,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Fresh Hub",
        description: "Fresh Farm Products Payment",
        order_id: orderData.id,
        handler: function (response) {
          console.log("🎉 Payment Success:", response);
          alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
          
          // Reset form
          setFormData({ name: "", email: "", phone: "", amount: "" });
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#28a745",
        },
        modal: {
          ondismiss: function() {
            console.log("❌ Payment cancelled by user");
            setLoading(false);
          }
        }
      };

      console.log("🚀 Opening Razorpay with options:", paymentOptions);
      
      // Wait for script to load
      if (typeof window.Razorpay === 'undefined') {
        alert("Razorpay script not loaded. Please refresh and try again.");
        return;
      }

      const rzp = new window.Razorpay(paymentOptions);
      rzp.open();
      
    } catch (error) {
      console.error("💥 Payment Error:", error);
      alert("Payment failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      maxWidth: "500px", 
      margin: "0 auto", 
      padding: "20px",
      fontFamily: "Arial, sans-serif"
    }}>
      <h1 style={{ textAlign: "center", color: "#333" }}>🚀 Fresh Payment System</h1>
      
      {/* Debug Panel */}
      <div style={{
        background: "linear-gradient(45deg, #ff6b6b, #4ecdc4)",
        color: "white",
        padding: "15px",
        borderRadius: "10px",
        marginBottom: "20px",
        textAlign: "center"
      }}>
        <strong>🔑 ACTIVE KEY: rzp_test_Fg7MWBV0KYlx07</strong><br/>
        <small>{debugInfo}</small>
      </div>

      <form onSubmit={handlePayment} style={{
        background: "#f8f9fa",
        padding: "25px",
        borderRadius: "10px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
      }}>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "12px",
              border: "2px solid #ddd",
              borderRadius: "5px",
              fontSize: "16px"
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "12px",
              border: "2px solid #ddd",
              borderRadius: "5px",
              fontSize: "16px"
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Phone:</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "12px",
              border: "2px solid #ddd",
              borderRadius: "5px",
              fontSize: "16px"
            }}
          />
        </div>

        <div style={{ marginBottom: "25px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Amount (₹):</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            min="1"
            style={{
              width: "100%",
              padding: "12px",
              border: "2px solid #ddd",
              borderRadius: "5px",
              fontSize: "16px"
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "15px",
            background: loading ? "#ccc" : "linear-gradient(45deg, #28a745, #20c997)",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "18px",
            fontWeight: "bold",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "all 0.3s ease"
          }}
        >
          {loading ? "🔄 Processing..." : "💳 Pay Now"}
        </button>
      </form>
      
      <div style={{
        marginTop: "20px",
        padding: "10px",
        background: "#e9ecef",
        borderRadius: "5px",
        fontSize: "12px",
        textAlign: "center"
      }}>
        🔒 Secure payment powered by Razorpay<br/>
        Component loaded: {new Date().toLocaleString()}
      </div>
    </div>
  );
}