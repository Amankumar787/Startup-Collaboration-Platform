import { verifyToken } from "../../utils/generateToken.js";
import Message         from "./message.model.js";

// Track online users: userId → socketId
const onlineUsers = new Map();

export const initSocket = (io) => {
  // Auth middleware for socket
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Authentication required"));

    try {
      const decoded  = verifyToken(token);
      socket.userId  = decoded.id;
      socket.userRole = decoded.role;
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.userId;
    console.log(`🔌 User connected: ${userId}`);

    // Register user as online
    onlineUsers.set(userId, socket.id);

    // Broadcast online status
    io.emit("user:online", { userId });

    // ── Join a room (for project-based chat) ─────────────────────────────────
    socket.on("room:join", (roomId) => {
      socket.join(roomId);
      console.log(`👥 User ${userId} joined room ${roomId}`);
    });

    socket.on("room:leave", (roomId) => {
      socket.leave(roomId);
    });

    // ── Private message ───────────────────────────────────────────────────────
    socket.on("message:send", async (data) => {
      try {
        const { receiverId, text } = data;

        const message = await Message.create({
          sender:   userId,
          receiver: receiverId,
          text,
        });

        await message.populate("sender",   "name profileImage");
        await message.populate("receiver", "name profileImage");

        // Send to receiver if online
        const receiverSocketId = onlineUsers.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("message:receive", message);
        }

        // Confirm to sender
        socket.emit("message:sent", message);
      } catch (error) {
        socket.emit("message:error", { error: error.message });
      }
    });

    // ── Typing indicator ──────────────────────────────────────────────────────
    socket.on("typing:start", ({ receiverId }) => {
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("typing:start", { userId });
      }
    });

    socket.on("typing:stop", ({ receiverId }) => {
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("typing:stop", { userId });
      }
    });

    // ── Mark messages as read ─────────────────────────────────────────────────
    socket.on("message:read", async ({ senderId }) => {
      await Message.updateMany(
        { sender: senderId, receiver: userId, isRead: false },
        { isRead: true, readAt: new Date() }
      );

      const senderSocketId = onlineUsers.get(senderId);
      if (senderSocketId) {
        io.to(senderSocketId).emit("message:read", { by: userId });
      }
    });

    // ── Disconnect ────────────────────────────────────────────────────────────
    socket.on("disconnect", () => {
      onlineUsers.delete(userId);
      io.emit("user:offline", { userId });
      console.log(`❌ User disconnected: ${userId}`);
    });
  });
};

// Helper to get online users list
export const getOnlineUsers = () => Array.from(onlineUsers.keys());