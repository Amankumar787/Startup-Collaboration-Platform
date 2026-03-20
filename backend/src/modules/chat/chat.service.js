import Message  from "./message.model.js";
import User     from "../users/user.model.js";
import ApiError from "../../utils/ApiError.js";

export const sendMessage = async (senderId, receiverId, text) => {
  // Verify receiver exists
  const receiver = await User.findById(receiverId);
  if (!receiver) throw new ApiError(404, "Receiver not found");

  const message = await Message.create({
    sender:   senderId,
    receiver: receiverId,
    text,
  });

  return message
    .populate("sender",   "name profileImage")
    .then((m) => m.populate("receiver", "name profileImage"));
};

export const getConversation = async (userId1, userId2, query = {}) => {
  const { page = 1, limit = 50 } = query;
  const skip = (page - 1) * limit;

  const messages = await Message.find({
    $or: [
      { sender: userId1, receiver: userId2 },
      { sender: userId2, receiver: userId1 },
    ],
    isDeleted: false,
  })
    .populate("sender",   "name profileImage")
    .populate("receiver", "name profileImage")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  // Mark messages as read
  await Message.updateMany(
    { sender: userId2, receiver: userId1, isRead: false },
    { isRead: true, readAt: new Date() }
  );

  return messages.reverse();
};

export const getInbox = async (userId) => {
  // Get latest message from each conversation
  const messages = await Message.aggregate([
    {
      $match: {
        $or: [
          { sender:   new require("mongoose").Types.ObjectId(userId) },
          { receiver: new require("mongoose").Types.ObjectId(userId) },
        ],
        isDeleted: false,
      },
    },
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: {
          $cond: [
            { $eq: ["$sender", userId] },
            "$receiver",
            "$sender",
          ],
        },
        lastMessage: { $first: "$$ROOT" },
      },
    },
    { $replaceRoot: { newRoot: "$lastMessage" } },
    { $sort: { createdAt: -1 } },
    { $limit: 20 },
  ]);

  return messages;
};

export const getUnreadCount = async (userId) => {
  return Message.getUnreadCount(userId);
};

export const deleteMessage = async (messageId, userId) => {
  const message = await Message.findOne({
    _id:    messageId,
    sender: userId,
  });

  if (!message) throw new ApiError(404, "Message not found or unauthorized");

  message.isDeleted = true;
  await message.save();
  return message;
};