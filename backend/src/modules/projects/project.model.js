import mongoose from "mongoose";

const TeamMemberSchema = new mongoose.Schema(
  {
    user:     {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role:     { type: String, default: "Collaborator" },
    joinedAt: { type: Date,   default: Date.now },
  },
  { _id: false }
);

const ProjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
      minlength: [5,   "Title must be at least 5 characters"],
      maxlength: [100, "Title cannot exceed 100 characters"],
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      minlength: [20,   "Description must be at least 20 characters"],
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },

    founder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Founder is required"],
    },

    requiredSkills: {
      type: [String],
      default: [],
      validate: {
        validator: (arr) => arr.length <= 15,
        message: "Cannot require more than 15 skills",
      },
    },

    teamMembers: {
      type: [TeamMemberSchema],
      default: [],
    },

    maxTeamSize: {
      type: Number,
      default: 5,
      min: [1,  "Team size must be at least 1"],
      max: [20, "Team size cannot exceed 20"],
    },

    status: {
      type: String,
      enum: {
        values: ["open", "in-progress", "completed", "closed"],
        message: "Invalid project status",
      },
      default: "open",
    },

    coverImage: {
      url:      { type: String, default: "" },
      publicId: { type: String, default: "" },
    },

    tags: {
      type: [String],
      default: [],
    },

    applicationCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON:   { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
ProjectSchema.index({ founder: 1 });
ProjectSchema.index({ status: 1 });
ProjectSchema.index({ requiredSkills: 1 });
ProjectSchema.index({ createdAt: -1 });
ProjectSchema.index({ founder: 1, status: 1 });
ProjectSchema.index(
  { title: "text", description: "text", tags: "text" },
  { weights: { title: 3, tags: 2, description: 1 } }
);

// ─── Virtual: Is team full ────────────────────────────────────────────────────
ProjectSchema.virtual("isTeamFull").get(function () {
  return this.teamMembers.length >= this.maxTeamSize;
});

const Project = mongoose.model("Project", ProjectSchema);
export default Project;