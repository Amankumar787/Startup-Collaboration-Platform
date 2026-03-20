// src/modules/notifications/notification.model.js

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
      default: null,           // null = system notification
    },

    type: {
      type: String,
      required: true,
      enum: [
        "application_received",  // Founder: new application on project
        "application_accepted",  // Developer: got accepted
        "application_rejected",  // Developer: got rejected
        "new_message",           // New chat message
        "project_update",        // Project status changed
        "team_joined",           // Someone joined your team
      ],
    },

    message: {
      type: String,
      required: true,
      maxlength: [300, "Notification message cannot exceed 300 characters"],
    },

    // Deep link to the relevant resource
    link: {
      type: String,
      default: "",
    },

    // Reference to the source document
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

// Most common query: unread notifications for a user
NotificationSchema.index({ recipient: 1, isRead: 1 });

// Auto-delete notifications older than 30 days
NotificationSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 60 * 60 * 24 * 30 }   // TTL index
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
```

---

## 6. Relationships Map
```
// Users ──────────────────────────────────────────────
//   │
//   ├── (role: founder) ──┬── Projects (founder field)
//   │                     └── receives → Notifications
//   │
//   └── (role: developer) ─┬── Applications (applicant field)
//                          ├── Projects.teamMembers[]
//                          └── Messages (sender/receiver)

// Projects ───────────────────────────────────────────
//   │
//   ├── belongs to → Users (founder)
//   ├── has many  → Applications
//   ├── has many  → Users via teamMembers[]
//   └── scopes    → Messages (optional project field)

// Applications ───────────────────────────────────────
//   ├── belongs to → Projects
//   ├── belongs to → Users (applicant)
//   └── triggers  → Notifications on status change

// Messages ───────────────────────────────────────────
//   ├── belongs to → Users (sender)
//   ├── belongs to → Users (receiver)
//   └── scoped to → Projects (optional)