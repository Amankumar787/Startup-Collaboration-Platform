import Application from "./application.model.js";
import Project     from "../projects/project.model.js";
import ApiError    from "../../utils/ApiError.js";
import {
  createNotification,
} from "../notifications/notification.service.js";

export const applyToProject = async (applicantId, projectId, data) => {
  // Check project exists and is open
  const project = await Project.findById(projectId);
  if (!project)            throw new ApiError(404, "Project not found");
  if (project.status !== "open") throw new ApiError(400, "Project is not accepting applications");
  if (project.isTeamFull)  throw new ApiError(400, "Project team is full");

  // Check if already applied
  const existing = await Application.findOne({
    project:   projectId,
    applicant: applicantId,
  });
  if (existing) throw new ApiError(409, "You have already applied to this project");

  // Prevent founder from applying to own project
  if (project.founder.toString() === applicantId.toString()) {
    throw new ApiError(400, "You cannot apply to your own project");
  }

  const application = await Application.create({
    project:      projectId,
    applicant:    applicantId,
    message:      data.message,
    offeredSkills: data.offeredSkills || [],
  });

  // Notify founder
  await createNotification({
    recipient: project.founder,
    sender:    applicantId,
    type:      "application_received",
    message:   "Someone applied to your project",
    link:      `/projects/${projectId}/applications`,
    reference: { model: "Application", id: application._id },
  });

  return application.populate("applicant", "name profileImage skills");
};

export const getProjectApplications = async (projectId, founderId, query = {}) => {
  // Verify ownership
  const project = await Project.findOne({
    _id:     projectId,
    founder: founderId,
  });
  if (!project) throw new ApiError(404, "Project not found or unauthorized");

  const { status, page = 1, limit = 10 } = query;
  const filter = { project: projectId };
  if (status) filter.status = status;

  const skip  = (page - 1) * limit;
  const total = await Application.countDocuments(filter);

  const applications = await Application.find(filter)
    .populate("applicant", "name profileImage skills bio socialLinks")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  return {
    applications,
    pagination: {
      total,
      page:  Number(page),
      pages: Math.ceil(total / limit),
      limit: Number(limit),
    },
  };
};

export const getMyApplications = async (applicantId, query = {}) => {
  const { status, page = 1, limit = 10 } = query;
  const filter = { applicant: applicantId };
  if (status) filter.status = status;

  const skip  = (page - 1) * limit;
  const total = await Application.countDocuments(filter);

  const applications = await Application.find(filter)
    .populate("project", "title description status coverImage founder")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  return {
    applications,
    pagination: {
      total,
      page:  Number(page),
      pages: Math.ceil(total / limit),
      limit: Number(limit),
    },
  };
};

export const updateApplicationStatus = async (
  applicationId,
  founderId,
  { status, founderNote }
) => {
  const application = await Application.findById(applicationId)
    .populate("project");

  if (!application) throw new ApiError(404, "Application not found");

  // Verify the founder owns the project
  if (application.project.founder.toString() !== founderId.toString()) {
    throw new ApiError(403, "Not authorized to update this application");
  }

  application.status     = status;
  application.founderNote = founderNote || "";
  await application.save();

  // If accepted → add to team members
  if (status === "accepted") {
    await Project.findByIdAndUpdate(application.project._id, {
      $addToSet: {
        teamMembers: {
          user:     application.applicant,
          joinedAt: new Date(),
        },
      },
    });
  }

  // Notify applicant
  await createNotification({
    recipient: application.applicant,
    sender:    founderId,
    type:      status === "accepted" ? "application_accepted" : "application_rejected",
    message:   status === "accepted"
      ? "Your application was accepted!"
      : "Your application was not accepted this time.",
    link:      `/applications`,
    reference: { model: "Application", id: application._id },
  });

  return application;
};

export const withdrawApplication = async (applicationId, applicantId) => {
  const application = await Application.findOne({
    _id:       applicationId,
    applicant: applicantId,
    status:    "pending",
  });

  if (!application) {
    throw new ApiError(404, "Application not found or cannot be withdrawn");
  }

  application.status = "withdrawn";
  await application.save();

  // Decrement count
  await Project.findByIdAndUpdate(application.project, {
    $inc: { applicationCount: -1 },
  });

  return application;
};