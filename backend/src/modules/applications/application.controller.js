import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse  from "../../utils/ApiResponse.js";
import ApiError     from "../../utils/ApiError.js";
import { validationResult } from "express-validator";
import {
  applyToProject,
  getProjectApplications,
  getMyApplications,
  updateApplicationStatus,
  withdrawApplication,
} from "./application.service.js";

export const apply = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new ApiError(400, "Validation failed", errors.array());

  const application = await applyToProject(
    req.user._id,
    req.params.projectId,
    req.body
  );
  res.status(201).json(new ApiResponse(201, application, "Application submitted"));
});

export const getProjectApps = asyncHandler(async (req, res) => {
  const result = await getProjectApplications(
    req.params.projectId,
    req.user._id,
    req.query
  );
  res.status(200).json(new ApiResponse(200, result, "Applications fetched"));
});

export const getMyApps = asyncHandler(async (req, res) => {
  const result = await getMyApplications(req.user._id, req.query);
  res.status(200).json(new ApiResponse(200, result, "Your applications fetched"));
});

export const updateStatus = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new ApiError(400, "Validation failed", errors.array());

  const application = await updateApplicationStatus(
    req.params.id,
    req.user._id,
    req.body
  );
  res.status(200).json(new ApiResponse(200, application, "Application status updated"));
});

export const withdraw = asyncHandler(async (req, res) => {
  const application = await withdrawApplication(req.params.id, req.user._id);
  res.status(200).json(new ApiResponse(200, application, "Application withdrawn"));
});