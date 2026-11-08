import express from "express";

import {
    createDelivery,
    getDeliveries,
    getDeliveriesByShipment,
    updateDeliveryStatus
} from "../controllers/deliveryController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createDelivery);

router.get("/", protect, getDeliveries);

router.get(
    "/shipment/:shipmentId",
    protect,
    getDeliveriesByShipment
);

router.patch(
    "/:id/status",
    protect,
    updateDeliveryStatus
);

export default router;