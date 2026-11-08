import express from "express";

import {
    createBooking,
    getMyBookings,
    getBookingById,
    getAllBookings
} from "../controllers/bookingController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

// CUSTOMER
router.post(
    "/",
    protect,
    authorize("CUSTOMER"),
    createBooking
);

router.get(
    "/my",
    protect,
    authorize("CUSTOMER"),
    getMyBookings
);

// CUSTOMER / EMPLOYEE / ADMIN
router.get(
    "/:id",
    protect,
    authorize("CUSTOMER", "EMPLOYEE", "ADMIN"),
    getBookingById
);

// EMPLOYEE / ADMIN
router.get(
    "/",
    protect,
    authorize("EMPLOYEE", "ADMIN"),
    getAllBookings
);

export default router;