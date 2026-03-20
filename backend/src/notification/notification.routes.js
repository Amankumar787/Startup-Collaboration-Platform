// src/modules/notifications/notification.routes.js
import express from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import {
  getMyNotifications,
  markOneRead,
  markAllRead,
  deleteNotification,
} from "./notification.controller.js";

const router = express.Router();

router.use(protect);   // All routes require login

router.get("/",            getMyNotifications);   // GET  /api/v1/notifications
router.put("/:id/read",    markOneRead);           // PUT  /api/v1/notifications/:id/read
router.put("/mark-all",    markAllRead);           // PUT  /api/v1/notifications/mark-all
router.delete("/:id",      deleteNotification);   // DELETE /api/v1/notifications/:id

export default router;