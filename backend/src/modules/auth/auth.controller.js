import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse  from "../../utils/ApiResponse.js";
import ApiError     from "../../utils/ApiError.js";
import { registerUser, loginUser } from "./auth.service.js";
import { validationResult } from "express-validator";

export const register = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new ApiError(400, "Validation failed", errors.array());

  const { name, email, password, role } = req.body;
  const result = await registerUser({ name, email, password, role });

  res.status(201).json(new ApiResponse(201, result, "Registration successful"));
});

export const login = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new ApiError(400, "Validation failed", errors.array());

  const { email, password } = req.body;
  const result = await loginUser({ email, password });

  res.status(200).json(new ApiResponse(200, result, "Login successful"));
});

export const logout = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, null, "Logged out successfully"));
});

export const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, req.user, "User fetched"));
});