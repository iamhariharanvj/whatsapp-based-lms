import express from "express";
import * as messageController from "../controllers/messageController.mjs";

const router = express.Router();

router.post("/message/send", messageController.replyToMessage);

export default router;
