import express from "express";
import { protectRoutes } from "../middleware/auth.js";
import { authorize } from "../middleware/roleCheck.js";
import {
  createVisit,
  getDoctors,
  getMyVisits,
} from "../controllers/visitController.js";

const router = express.Router();

//Patient
router.get("/doctors", protectRoutes, authorize("patient"), getDoctors);
router.post("/", protectRoutes, authorize("patient"), createVisit);
router.get("/my-visits", protectRoutes, authorize("patient"), getMyVisits);

export default router;
