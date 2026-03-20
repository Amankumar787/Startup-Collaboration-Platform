import express from "express";
import {
  send,
  getMessages,
  getMyInbox,
  getUnread,
  remove,
} from "./chat.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.post("/",                  send);           // POST   /api/v1/messages
router.get("/inbox",              getMyInbox);     // GET    /api/v1/messages/inbox
router.get("/unread",             getUnread);      // GET    /api/v1/messages/unread
router.get("/:userId",            getMessages);    // GET    /api/v1/messages/:userId
router.delete("/:id",             remove);         // DELETE /api/v1/messages/:id

export default router;