import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

// Routes
import { connectDB } from "./config/db.js";
import ProductRoutes from "./routes/products.route.js";
import CartRoutes from "./routes/cart.route.js";
import AuthRoutes from "./routes/auth.route.js";
import PaymentRoutes from "./routes/paymentRoutes.js";
import FeedbackRoutes from "./routes/feedbackRoutes.js";

dotenv.config();

const app = express();

// Get __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Allow both local and Render frontend origins
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5176",
  "https://fresh-hub-3-frontend-14hu.onrender.com" // ✅ Render frontend domain
];

// ✅ CORS Configuration
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn("❌ Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allow cookies or authorization headers
  })
);

// ✅ Increase payload size limits for large requests (images, etc.)
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

// ✅ Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Register All Routes
app.use("/api/auth", AuthRoutes);
app.use("/api/products", ProductRoutes);
app.use("/api/cart", CartRoutes);
app.use("/api/payment", PaymentRoutes);
app.use("/api/feedback", FeedbackRoutes);

// ✅ Health check route
app.get("/", (req, res) => {
  res.send("✅ Fresh Hub API is running...");
});

// ✅ Start Server and Connect DB
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  try {
    await connectDB();
    console.log(`🚀 Server running on port ${PORT}`);
  } catch (error) {
    console.error("❌ Database Connection Error:", error);
    process.exit(1);
  }
});
