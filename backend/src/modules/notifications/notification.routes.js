import express from "express";
import {
  getMyNotifications,
  markOneRead,
  markAllRead,
  removeNotification,
} from "./notification.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = express.Router();

// All notification routes are protected
router.use(protect);

router.get("/",            getMyNotifications);   // GET    /api/v1/notifications
router.put("/mark-all",    markAllRead);           // PUT    /api/v1/notifications/mark-all
router.put("/:id/read",    markOneRead);           // PUT    /api/v1/notifications/:id/read
router.delete("/:id",      removeNotification);   // DELETE /api/v1/notifications/:id

export default router;