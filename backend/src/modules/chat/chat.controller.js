import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse  from "../../utils/ApiResponse.js";
import ApiError     from "../../utils/ApiError.js";
import {
  sendMessage,
  getConversation,
  getInbox,
  getUnreadCount,
  deleteMessage,
} from "./chat.service.js";

export const send = asyncHandler(async (req, res) => {
  const { receiverId, text } = req.body;
  if (!receiverId || !text) {
    throw new ApiError(400, "Receiver and message text are required");
  }

  const message = await sendMessage(req.user._id, receiverId, text);
  res.status(201).json(new ApiResponse(201, message, "Message sent"));
});

export const getMessages = asyncHandler(async (req, res) => {
  const messages = await getConversation(
    req.user._id,
    req.params.userId,
    req.query
  );
  res.status(200).json(new ApiResponse(200, messages, "Messages fetched"));
});

export const getMyInbox = asyncHandler(async (req, res) => {
  const inbox = await getInbox(req.user._id);
  res.status(200).json(new ApiResponse(200, inbox, "Inbox fetched"));
});

export const getUnread = asyncHandler(async (req, res) => {
  const count = await getUnreadCount(req.user._id);
  res.status(200).json(new ApiResponse(200, { count }, "Unread count fetched"));
});

export const remove = asyncHandler(async (req, res) => {
  await deleteMessage(req.params.id, req.user._id);
  res.status(200).json(new ApiResponse(200, null, "Message deleted"));
});