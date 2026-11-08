import express from "express";

import {
    createPayment,
    getPayments,
    getPaymentsByInvoice
} from "../controllers/paymentController.js";

const router = express.Router();

router.post("/", createPayment);

router.get("/", getPayments);

router.get(
    "/invoice/:invoiceId",
    getPaymentsByInvoice
);

export default router;