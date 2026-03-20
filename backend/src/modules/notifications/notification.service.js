import Notification from "./notification.model.js";
import ApiError     from "../../utils/ApiError.js";

// Called internally by other services
export const createNotification = async ({
  recipient,
  sender,
  type,
  message,
  link,
  reference,
}) => {
  try {
    const notification = await Notification.create({
      recipient,
      sender,
      type,
      message,
      link,
      reference,
    });
    return notification;
  } catch (error) {
    // Notifications should never crash the main flow
    console.error("Notification creation failed:", error.message);
  }
};

export const getUserNotifications = async (userId, query = {}) => {
  const { page = 1, limit = 20, unreadOnly } = query;

  const filter = { recipient: userId };
  if (unreadOnly === "true") filter.isRead = false;

  const skip  = (page - 1) * limit;
  const total = await Notification.countDocuments(filter);

  const notifications = await Notification.find(filter)
    .populate("sender", "name profileImage")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const unreadCount = await Notification.countDocuments({
    recipient: userId,
    isRead:    false,
  });

  return {
    notifications,
    unreadCount,
    pagination: {
      total,
      page:  Number(page),
      pages: Math.ceil(total / limit),
      limit: Number(limit),
    },
  };
};

export const markOneAsRead = async (notificationId, userId) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, recipient: userId },
    { isRead: true, readAt: new Date() },
    { new: true }
  );

  if (!notification) throw new ApiError(404, "Notification not found");
  return notification;
};

export const markAllAsRead = async (userId) => {
  await Notification.markAllRead(userId);
  return { message: "All notifications marked as read" };
};

export const deleteNotification = async (notificationId, userId) => {
  const notification = await Notification.findOneAndDelete({
    _id:       notificationId,
    recipient: userId,
  });

  if (!notification) throw new ApiError(404, "Notification not found");
  return notification;
};