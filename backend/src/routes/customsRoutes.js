import express from "express";

import {
    createCustoms,
    getMyCustoms,
    getCustomsList,
    updateCustomsStatus
} from "../controllers/customsController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();


// CUSTOMER: Tạo tờ khai
router.post(
    "/",
    protect,
    authorize("CUSTOMER"),
    createCustoms
);


// CUSTOMER: Xem tờ khai của Shipment
router.get(
    "/my/:shipmentId",
    protect,
    authorize("CUSTOMER"),
    getMyCustoms
);


// EMPLOYEE / ADMIN: Xem tất cả tờ khai
router.get(
    "/",
    protect,
    authorize("EMPLOYEE", "ADMIN"),
    getCustomsList
);


// EMPLOYEE / ADMIN: Cập nhật trạng thái
router.patch(
    "/:id/status",
    protect,
    authorize("EMPLOYEE", "ADMIN"),
    updateCustomsStatus
);


export default router;