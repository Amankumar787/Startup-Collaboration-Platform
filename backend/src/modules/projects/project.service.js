import Project from "./project.model.js";
import ApiError from "../../utils/ApiError.js";
import cloudinary from "../../config/cloudinary.js";

export const createProject = async (founderId, projectData) => {
  const project = await Project.create({
    ...projectData,
    founder: founderId,
  });
  return project.populate("founder", "name profileImage");
};

export const getAllProjects = async (query = {}) => {
  const {
    status,
    skills,
    search,
    page  = 1,
    limit = 10,
  } = query;

  const filter = {};

  if (status) filter.status = status;

  if (skills) {
    const skillArray = skills.split(",").map((s) => s.trim());
    filter.requiredSkills = { $in: skillArray };
  }

  if (search) {
    filter.$text = { $search: search };
  }

  const skip  = (page - 1) * limit;
  const total = await Project.countDocuments(filter);

  const projects = await Project.find(filter)
    .populate("founder", "name profileImage role")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  return {
    projects,
    pagination: {
      total,
      page:  Number(page),
      pages: Math.ceil(total / limit),
      limit: Number(limit),
    },
  };
};

export const getProjectById = async (projectId) => {
  const project = await Project.findByIdAndUpdate(
    projectId,
    { $inc: { views: 1 } },
    { new: true }
  )
    .populate("founder",          "name profileImage bio")
    .populate("teamMembers.user", "name profileImage skills");

  if (!project) throw new ApiError(404, "Project not found");
  return project;
};

export const getFounderProjects = async (founderId, query = {}) => {
  const { status, page = 1, limit = 10 } = query;
  const filter = { founder: founderId };
  if (status) filter.status = status;

  const skip     = (page - 1) * limit;
  const total    = await Project.countDocuments(filter);
  const projects = await Project.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  return {
    projects,
    pagination: {
      total,
      page:  Number(page),
      pages: Math.ceil(total / limit),
      limit: Number(limit),
    },
  };
};

export const updateProject = async (projectId, founderId, updateData) => {
  const project = await Project.findOne({
    _id:     projectId,
    founder: founderId,
  });

  if (!project) throw new ApiError(404, "Project not found or unauthorized");

  const allowedFields = [
    "title", "description", "requiredSkills",
    "maxTeamSize", "status", "tags",
  ];

  allowedFields.forEach((field) => {
    if (updateData[field] !== undefined) {
      project[field] = updateData[field];
    }
  });

  await project.save();
  return project;
};

export const deleteProject = async (projectId, founderId) => {
  const project = await Project.findOneAndDelete({
    _id:     projectId,
    founder: founderId,
  });

  if (!project) throw new ApiError(404, "Project not found or unauthorized");

  // Delete cover image from Cloudinary if exists
  if (project.coverImage?.publicId) {
    await cloudinary.uploader.destroy(project.coverImage.publicId);
  }

  return project;
};

export const updateProjectCover = async (projectId, founderId, file) => {
  const project = await Project.findOne({
    _id:     projectId,
    founder: founderId,
  });

  if (!project) throw new ApiError(404, "Project not found or unauthorized");

  if (project.coverImage?.publicId) {
    await cloudinary.uploader.destroy(project.coverImage.publicId);
  }

  project.coverImage = {
    url:      file.path,
    publicId: file.filename,
  };

  await project.save();
  return project;
};