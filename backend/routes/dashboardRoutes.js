import express from "express";
import { getDashboardStats } from "../controllers/dashboardController.js";
import { authorize } from "../middleware/roleCheck.js";
import { protectRoutes } from "../middleware/auth.js";

const router = express.Router();

router.get("/stats", protectRoutes, authorize("finance"), getDashboardStats);

export default router;
