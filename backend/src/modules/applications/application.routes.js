import express from "express";
import {
  apply,
  getProjectApps,
  getMyApps,
  updateStatus,
  withdraw,
} from "./application.controller.js";
import { protect }   from "../../middlewares/auth.middleware.js";
import { restrictTo } from "../../middlewares/role.middleware.js";
import {
  validateApply,
  validateUpdateStatus,
} from "./application.validation.js";

const router = express.Router();

router.use(protect);

// Developer routes
router.post("/project/:projectId",  restrictTo("developer"), validateApply,        apply);
router.get("/my",                   restrictTo("developer"),                        getMyApps);
router.put("/:id/withdraw",         restrictTo("developer"),                        withdraw);

// Founder routes
router.get("/project/:projectId",   restrictTo("founder"),                          getProjectApps);
router.put("/:id/status",           restrictTo("founder"),   validateUpdateStatus,  updateStatus);

export default router;