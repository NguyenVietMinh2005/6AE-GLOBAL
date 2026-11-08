import express from "express";

import {
    createContainer,
    getContainers,
    getContainersByShipment,
    updateContainerStatus
} from "../controllers/containerController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// EMPLOYEE / ADMIN
router.post("/", protect, createContainer);

// EMPLOYEE / ADMIN
router.get("/", protect, getContainers);

// EMPLOYEE / ADMIN
router.get(
    "/shipment/:shipmentId",
    protect,
    getContainersByShipment
);

// EMPLOYEE / ADMIN
router.patch(
    "/:id/status",
    protect,
    updateContainerStatus
);

export default router;