import express from "express";

import {
    createShipment,
    getMyShipments,
    trackShipment,
    getShipmentById,
    updateShipmentInfo,
    updateShipmentStatus,
    getAllShipments // Đảm bảo bạn đã có hàm này trong shipmentController.js
} from "../controllers/shipmentController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

// ADMIN / EMPLOYEE: Lấy TẤT CẢ Shipment (Dùng cho bảng quản lý của Admin)
router.get(
    "/",
    protect,
    authorize("ADMIN", "EMPLOYEE"),
    getAllShipments
);

// ADMIN / EMPLOYEE: Tạo Shipment (Đã sửa lỗi quyền)
router.post(
    "/",
    protect,
    authorize("ADMIN", "EMPLOYEE"),
    createShipment
);

// ADMIN / EMPLOYEE: Cập nhật trạng thái Shipment
router.put(
    "/:id/status",
    protect,
    authorize("ADMIN", "EMPLOYEE"),
    updateShipmentStatus
);

// ADMIN / EMPLOYEE: Cập nhật thông tin vận chuyển
router.put(
    "/:id/info",
    protect,
    authorize("ADMIN", "EMPLOYEE"),
    updateShipmentInfo
);

// CUSTOMER: Xem Shipment của mình
router.get(
    "/my",
    protect,
    authorize("CUSTOMER"),
    getMyShipments
);

// TẤT CẢ: Tra cứu bằng số Shipment (Route này đặt trước /:id)
router.get(
    "/track/:shipmentNumber",
    trackShipment
);

// TẤT CẢ: Xem Shipment cụ thể
router.get(
    "/:id",
    protect,
    authorize("CUSTOMER", "EMPLOYEE", "ADMIN"),
    getShipmentById
);

export default router;