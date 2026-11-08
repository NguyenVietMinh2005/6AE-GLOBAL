import express from "express";

import {
    uploadDocument,
    getMyDocuments,
    getPendingDocuments,
    reviewDocument
} from "../controllers/documentController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// CUSTOMER: Upload chứng từ
router.post(
    "/",
    protect,
    authorize("CUSTOMER"),
    upload.single("file"),
    uploadDocument
);


// EMPLOYEE / ADMIN: Xem chứng từ chờ duyệt
router.get(
    "/pending",
    protect,
    authorize("EMPLOYEE", "ADMIN"),
    getPendingDocuments
);

// CUSTOMER: Xem chứng từ của Shipment
router.get(
    "/shipment/:shipmentId",
    protect,
    authorize("CUSTOMER"),
    getMyDocuments
);

// EMPLOYEE / ADMIN: Duyệt hoặc từ chối chứng từ
router.put(
    "/:id/review",
    protect,
    authorize("EMPLOYEE", "ADMIN"),
    reviewDocument
);

export default router;