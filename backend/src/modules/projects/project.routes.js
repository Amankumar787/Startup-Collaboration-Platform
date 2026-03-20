import express from "express";
import {
  create,
  getAll,
  getOne,
  getMyProjects,
  update,
  remove,
  uploadCover,
} from "./project.controller.js";
import { protect }                from "../../middlewares/auth.middleware.js";
import { restrictTo }             from "../../middlewares/role.middleware.js";
import { uploadProjectCover }     from "../../middlewares/upload.middleware.js";
import {
  validateCreateProject,
  validateUpdateProject,
} from "./project.validation.js";

const router = express.Router();

// Public routes
router.get("/",    getAll);
router.get("/:id", getOne);

// Protected routes
router.use(protect);

router.get("/founder/my",                           restrictTo("founder"), getMyProjects);
router.post("/",           validateCreateProject,   restrictTo("founder"), create);
router.put("/:id",         validateUpdateProject,   restrictTo("founder"), update);
router.delete("/:id",                               restrictTo("founder"), remove);
router.post("/:id/cover",  uploadProjectCover,      restrictTo("founder"), uploadCover);

export default router;