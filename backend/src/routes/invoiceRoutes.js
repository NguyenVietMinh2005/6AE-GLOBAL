import express from "express";

import {
    createInvoice,
    getInvoices,
    getInvoicesByShipment,
    updateInvoiceStatus
} from "../controllers/invoiceController.js";

const router = express.Router();

// Tạo Invoice
router.post("/", createInvoice);

// Lấy tất cả Invoice
router.get("/", getInvoices);

// Lấy Invoice theo Shipment
router.get("/shipment/:shipmentId", getInvoicesByShipment);

// Cập nhật trạng thái Invoice
router.patch("/:id/status", updateInvoiceStatus);

export default router;