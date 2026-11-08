import express from "express";

import {
    createCustomer,
    getMyCustomer,
    updateMyCustomer,
    getCustomers,
    getCustomerById
} from "../controllers/customerController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

// CUSTOMER: Tạo thông tin khách hàng
router.post(
    "/",
    protect,
    authorize("CUSTOMER"),
    createCustomer
);

// CUSTOMER: Xem thông tin của mình
router.get(
    "/me",
    protect,
    authorize("CUSTOMER"),
    getMyCustomer
);

// CUSTOMER: Cập nhật thông tin của mình
router.put(
    "/me",
    protect,
    authorize("CUSTOMER"),
    updateMyCustomer
);

// EMPLOYEE / ADMIN: Xem danh sách khách hàng
router.get(
    "/",
    protect,
    authorize("EMPLOYEE", "ADMIN"),
    getCustomers
);

// EMPLOYEE / ADMIN: Xem khách hàng theo ID
router.get(
    "/:id",
    protect,
    authorize("EMPLOYEE", "ADMIN"),
    getCustomerById
);

export default router;