import express from "express";

import { getUsers, getAllCustomers } from "../controllers/userController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", getUsers);
router.get("/customers", protect, authorize("ADMIN", "EMPLOYEE"), getAllCustomers);

export default router;