import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse  from "../../utils/ApiResponse.js";
import ApiError     from "../../utils/ApiError.js";
import { validationResult } from "express-validator";
import {
  createProject,
  getAllProjects,
  getProjectById,
  getFounderProjects,
  updateProject,
  deleteProject,
  updateProjectCover,
} from "./project.service.js";

export const create = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new ApiError(400, "Validation failed", errors.array());
  const project = await createProject(req.user._id, req.body);
  res.status(201).json(new ApiResponse(201, project, "Project created"));
});

export const getAll = asyncHandler(async (req, res) => {
  const result = await getAllProjects(req.query);
  res.status(200).json(new ApiResponse(200, result, "Projects fetched"));
});

export const getOne = asyncHandler(async (req, res) => {
  const project = await getProjectById(req.params.id);
  res.status(200).json(new ApiResponse(200, project, "Project fetched"));
});

export const getMyProjects = asyncHandler(async (req, res) => {
  const result = await getFounderProjects(req.user._id, req.query);
  res.status(200).json(new ApiResponse(200, result, "Your projects fetched"));
});

export const update = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new ApiError(400, "Validation failed", errors.array());
  const project = await updateProject(req.params.id, req.user._id, req.body);
  res.status(200).json(new ApiResponse(200, project, "Project updated"));
});

export const remove = asyncHandler(async (req, res) => {
  await deleteProject(req.params.id, req.user._id);
  res.status(200).json(new ApiResponse(200, null, "Project deleted"));
});

export const uploadCover = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, "No image file provided");
  const project = await updateProjectCover(req.params.id, req.user._id, req.file);
  res.status(200).json(new ApiResponse(200, project, "Cover image updated"));
});