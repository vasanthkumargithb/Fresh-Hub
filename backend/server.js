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

// ✅ Allow localhost origins for development (FIXED - Added 5174)
const allowedOrigins = [
  "http://localhost:5173", 
  "http://localhost:5174",  // Added this line
  "http://localhost:5176"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ✅ Increase payload size limits for file uploads and base64 images
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

// ✅ Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Register All Routes
app.use("/api/auth", AuthRoutes);
app.use("/api/products", ProductRoutes);
app.use("/api/cart", CartRoutes);
app.use("/api/payment", PaymentRoutes); // includes create-order and record
app.use("/api/feedback", FeedbackRoutes);

// ✅ Test route
app.get("/", (req, res) => {
  res.send("✅ API is running...");
});

// ✅ Start server and connect to DB
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  try {
    await connectDB();
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  } catch (error) {
    console.error("❌ DB Connection Error:", error);
    process.exit(1);
  }
});