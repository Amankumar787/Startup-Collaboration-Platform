import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse  from "../../utils/ApiResponse.js";
import ApiError     from "../../utils/ApiError.js";
import { validationResult } from "express-validator";
import {
  getUserById,
  getAllDevelopers,
  updateUserProfile,
  updateProfileImage,
} from "./user.service.js";

export const getProfile = asyncHandler(async (req, res) => {
  const user = await getUserById(req.params.id);
  res.status(200).json(new ApiResponse(200, user, "User fetched"));
});

export const getDevelopers = asyncHandler(async (req, res) => {
  const result = await getAllDevelopers(req.query);
  res.status(200).json(new ApiResponse(200, result, "Developers fetched"));
});

export const updateProfile = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new ApiError(400, "Validation failed", errors.array());

  const user = await updateUserProfile(req.user._id, req.body);
  res.status(200).json(new ApiResponse(200, user, "Profile updated"));
});

export const uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, "No image file provided");

  const user = await updateProfileImage(req.user._id, req.file);
  res.status(200).json(new ApiResponse(200, user, "Avatar updated"));
});