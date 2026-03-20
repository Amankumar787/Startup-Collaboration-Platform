import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    type: {
      type: String,
      required: true,
      enum: [
        "application_received",
        "application_accepted",
        "application_rejected",
        "new_message",
        "project_update",
        "team_joined",
      ],
    },

    message: {
      type: String,
      required: true,
      maxlength: [300, "Notification message cannot exceed 300 characters"],
    },

    link: {
      type: String,
      default: "",
    },

    reference: {
      model: {
        type: String,
        enum: ["Project", "Application", "Message", "User"],
      },
      id: {
        type: mongoose.Schema.Types.ObjectId,
      },
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    readAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
NotificationSchema.index({ recipient: 1 });
NotificationSchema.index({ createdAt: -1 });
NotificationSchema.index({ recipient: 1, isRead: 1 });

// Auto-delete notifications older than 30 days
NotificationSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 60 * 60 * 24 * 30 }
);

// ─── Static: Mark all as read ─────────────────────────────────────────────────
NotificationSchema.statics.markAllRead = function (userId) {
  return this.updateMany(
    { recipient: userId, isRead: false },
    { isRead: true, readAt: new Date() }
  );
};

const Notification = mongoose.model("Notification", NotificationSchema);
export default Notification;