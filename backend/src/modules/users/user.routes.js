import express from "express";
import {
  getProfile,
  getDevelopers,
  updateProfile,
  uploadAvatar,
} from "./user.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { uploadAvatar as uploadAvatarMiddleware } from "../../middlewares/upload.middleware.js";
import { validateUpdateProfile } from "./user.validation.js";

const router = express.Router();

router.get("/developers",        getDevelopers);
router.get("/:id",               getProfile);
router.put("/profile",           protect, validateUpdateProfile, updateProfile);
router.post("/upload-avatar",    protect, uploadAvatarMiddleware, uploadAvatar);

export default router;