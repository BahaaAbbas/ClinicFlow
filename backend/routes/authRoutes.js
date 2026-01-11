import express from "express";
import {
  checkAuth,
  login,
  logout,
  register,
  testAuth,
} from "../controllers/authController.js";
import { protectRoutes } from "../middleware/auth.js";
import { authorize } from "../middleware/roleCheck.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/check", checkAuth);
router.get("/test", protectRoutes, authorize("patient"), testAuth);

export default router;
