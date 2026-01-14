import express from "express";
import { protectRoutes } from "../middleware/auth.js";
import { authorize } from "../middleware/roleCheck.js";
import {
  addTreatment,
  completeVisit,
  createVisit,
  getActiveVisit,
  getAllVisits,
  getDoctors,
  getMyVisits,
  getPendingVisits,
  searchVisits,
  startVisit,
  updateMedicalNotes,
} from "../controllers/visitController.js";

const router = express.Router();

//Patient
router.get("/doctors", protectRoutes, authorize("patient"), getDoctors);
router.post("/", protectRoutes, authorize("patient"), createVisit);
router.get("/my-visits", protectRoutes, authorize("patient"), getMyVisits);

//Doctor
router.get("/active", protectRoutes, authorize("doctor"), getActiveVisit);
router.get("/pending", protectRoutes, authorize("doctor"), getPendingVisits);
router.put("/:id/start", protectRoutes, authorize("doctor"), startVisit);
router.put(
  "/:id/add-treatment",
  protectRoutes,
  authorize("doctor"),
  addTreatment
);
router.put(
  "/:id/notes",
  protectRoutes,
  authorize("doctor"),
  updateMedicalNotes
);
router.put("/:id/complete", protectRoutes, authorize("doctor"), completeVisit);

//finance
router.get("/search", protectRoutes, authorize("finance"), searchVisits);
router.get("/", protectRoutes, authorize("finance"), getAllVisits);

export default router;
