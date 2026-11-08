import express from "express";

import {
    getMyNotifications,
    markNotificationAsRead
} from "../controllers/notificationController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();


// CUSTOMER: Xem thông báo
router.get(
    "/",
    protect,
    authorize("CUSTOMER"),
    getMyNotifications
);


// CUSTOMER: Đánh dấu đã đọc
router.put(
    "/:id/read",
    protect,
    authorize("CUSTOMER"),
    markNotificationAsRead
);

export default router;