import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { globalErrorHandler } from "./middlewares/errorHandler.js";
import { apiLimiter } from "./middlewares/rateLimiter.js";
import authRoutes         from "./modules/auth/auth.routes.js";
import userRoutes         from "./modules/users/user.routes.js";
import projectRoutes      from "./modules/projects/project.routes.js";
import applicationRoutes  from "./modules/applications/application.routes.js";
import notificationRoutes from "./modules/notifications/notification.routes.js";
import messageRoutes      from "./modules/chat/chat.routes.js";

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api", apiLimiter);

app.use("/api/v1/auth",          authRoutes);
app.use("/api/v1/users",         userRoutes);
app.use("/api/v1/projects",      projectRoutes);
app.use("/api/v1/applications",  applicationRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/messages",      messageRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

app.use(globalErrorHandler);

export default app;