import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse  from "../../utils/ApiResponse.js";
import {
  getUserNotifications,
  markOneAsRead,
  markAllAsRead,
  deleteNotification,
} from "./notification.service.js";

export const getMyNotifications = asyncHandler(async (req, res) => {
  const result = await getUserNotifications(req.user._id, req.query);
  res.status(200).json(new ApiResponse(200, result, "Notifications fetched"));
});

export const markOneRead = asyncHandler(async (req, res) => {
  const notification = await markOneAsRead(req.params.id, req.user._id);
  res.status(200).json(new ApiResponse(200, notification, "Notification marked as read"));
});

export const markAllRead = asyncHandler(async (req, res) => {
  const result = await markAllAsRead(req.user._id);
  res.status(200).json(new ApiResponse(200, result, "All notifications marked as read"));
});

export const removeNotification = asyncHandler(async (req, res) => {
  await deleteNotification(req.params.id, req.user._id);
  res.status(200).json(new ApiResponse(200, null, "Notification deleted"));
});