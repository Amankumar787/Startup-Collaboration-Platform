import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "Project reference is required"],
    },

    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Applicant reference is required"],
    },

    message: {
      type: String,
      required: [true, "Application message is required"],
      minlength: [20,   "Message must be at least 20 characters"],
      maxlength: [1000, "Message cannot exceed 1000 characters"],
      trim: true,
    },

    status: {
      type: String,
      enum: {
        values: ["pending", "accepted", "rejected", "withdrawn"],
        message: "Invalid application status",
      },
      default: "pending",
    },

    offeredSkills: {
      type: [String],
      default: [],
    },

    founderNote: {
      type: String,
      maxlength: [500, "Founder note cannot exceed 500 characters"],
      default: "",
    },

    reviewedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
ApplicationSchema.index({ project: 1 });
ApplicationSchema.index({ applicant: 1 });
ApplicationSchema.index({ status: 1 });
ApplicationSchema.index({ createdAt: -1 });
ApplicationSchema.index({ project: 1, status: 1 });
ApplicationSchema.index({ applicant: 1, status: 1 });
ApplicationSchema.index(
  { project: 1, applicant: 1 },
  { unique: true, name: "unique_application_per_project" }
);

// ─── Pre-save: Set reviewedAt when status changes ────────────────────────────
ApplicationSchema.pre("save", function (next) {
  if (
    this.isModified("status") &&
    ["accepted", "rejected"].includes(this.status)
  ) {
    this.reviewedAt = new Date();
  }
  next();
});

// ─── Post-save: Increment project applicationCount ───────────────────────────
ApplicationSchema.post("save", async function (doc) {
  if (doc.isNew) {
    await mongoose
      .model("Project")
      .findByIdAndUpdate(doc.project, { $inc: { applicationCount: 1 } });
  }
});

const Application = mongoose.model("Application", ApplicationSchema);
export default Application;