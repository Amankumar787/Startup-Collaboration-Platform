import express from "express";
import { register, login, getMe, logout } from "./auth.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { authLimiter } from "../../middlewares/rateLimiter.js";
import { validateRegister, validateLogin } from "./auth.validation.js";

const router = express.Router();

router.post("/register", authLimiter, validateRegister, register);
router.post("/login",    authLimiter, validateLogin,    login);
router.post("/logout",   protect,                       logout);
router.get("/me",        protect,                       getMe);

export default router;