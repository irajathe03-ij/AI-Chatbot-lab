
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  createChat,
  getChats,
  getChatById,
  deleteChat,
} = require("../controllers/chatController");

// Create a new chat
router.post("/", authMiddleware, createChat);

// Get all chats
router.get("/", authMiddleware, getChats);

// Get a particular chat
router.get("/:chatId", authMiddleware, getChatById);

// Delete a chat
router.delete("/:chatId", authMiddleware, deleteChat);

module.exports = router;
