import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";

import quotationRoutes from "./routes/quotationRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import shipmentRoutes from "./routes/shipmentRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import customsRoutes from "./routes/customsRoutes.js";
import containerRoutes from "./routes/containerRoutes.js";
import deliveryRoutes from "./routes/deliveryRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

dotenv.config();

const app = express();

// 1. Cấu hình giới hạn CORS (Chỉ cho phép Frontend gọi API)
const corsOptions = {
    origin: process.env.CLIENT_URL || "http://localhost:5173", // Thay bằng domain React của bạn khi deploy
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true, // Cho phép gửi token/cookie nếu cần
};
app.use(cors(corsOptions));

app.use(express.json());

// Khai báo Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

app.use("/api/quotations", quotationRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/shipments", shipmentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/customs", customsRoutes);
app.use("/api/containers", containerRoutes);
app.use("/api/deliveries", deliveryRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/payments", paymentRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "6AE GLOBAL Backend is running"
    });
});

// 2. Global Error Handler (Bắt lỗi tổng)
// Phải được đặt ở ĐÂY, sau tất cả các route
app.use((err, req, res, next) => {
    console.error("🔥 Global Error Detail:", err); // In chi tiết lỗi ra terminal
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || "Lỗi máy chủ nội bộ (Internal Server Error)",
        error: err.stack // In ra vết lỗi để dễ debug
    });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
};

startServer();