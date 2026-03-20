// src/modules/chat/message.model.js

import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Sender is required"],
    },

    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Receiver is required"],
    },

    // Optional: scope messages to a project context
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      default: null,
    },

    text: {
      type: String,
      required: [true, "Message text is required"],
      maxlength: [2000, "Message cannot exceed 2000 characters"],
      trim: true,
    },

    type: {
      type: String,
      enum: ["text", "image", "file"],
      default: "text",
    },

    // For image/file messages
    attachment: {
      url:      { type: String, default: "" },
      publicId: { type: String, default: "" },
      fileName: { type: String, default: "" },
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    readAt: {
      type: Date,
      default: null,
    },

    isDeleted: {
      type: Boolean,
      default: false,        // Soft delete
      select: false,
    },
  },
  {
    timestamps: true,        // createdAt = message timestamp
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
MessageSchema.index({ sender: 1 });
MessageSchema.index({ receiver: 1 });
MessageSchema.index({ createdAt: -1 });

// Compound: Fetch full conversation between two users (most common query)
MessageSchema.index({ sender: 1, receiver: 1 });
MessageSchema.index({ receiver: 1, sender: 1 });

// Compound: Unread message count per user
MessageSchema.index({ receiver: 1, isRead: 1 });

// ─── Static: Get conversation between two users ───────────────────────────────
MessageSchema.statics.getConversation = function (userId1, userId2, limit = 50) {
  return this.find({
    $or: [
      { sender: userId1, receiver: userId2 },
      { sender: userId2, receiver: userId1 },
    ],
    isDeleted: false,
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("sender",   "name profileImage")
    .populate("receiver", "name profileImage");
};

// ─── Static: Get unread count for a user ─────────────────────────────────────
MessageSchema.statics.getUnreadCount = function (userId) {
  return this.countDocuments({ receiver: userId, isRead: false });
};

const Message = mongoose.model("Message", MessageSchema);
export default Message;