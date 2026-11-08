import express from "express";

import {
    createQuotation,
    getMyQuotations,
    getAllQuotations,
    sendQuotation,
    acceptQuotation
} from "../controllers/quotationController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

// CUSTOMER
router.post(
    "/",
    protect,
    authorize("CUSTOMER"),
    createQuotation
);

router.get(
    "/my",
    protect,
    authorize("CUSTOMER"),
    getMyQuotations
);

router.put(
    "/:id/accept",
    protect,
    authorize("CUSTOMER"),
    acceptQuotation
);

// EMPLOYEE / ADMIN
router.get(
    "/",
    protect,
    authorize("EMPLOYEE", "ADMIN"),
    getAllQuotations
);

router.put(
    "/:id/quote",
    protect,
    authorize("EMPLOYEE", "ADMIN"),
    sendQuotation
);

export default router;