const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
  sendMessage,
  getMessages,
} = require("../controllers/messageController");

// Send a message
router.post("/:chatId", authMiddleware, sendMessage);

// Get all messages from a chat
router.get("/:chatId", authMiddleware, getMessages);

module.exports = router;