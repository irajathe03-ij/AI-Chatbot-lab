
const Chat = require("../models/Chat");
const Message = require("../models/Message");

// Create a new chat
const createChat = async (req, res) => {
  try {
    const chat = await Chat.create({
      user: req.user.userId,
      title: "New Chat",
    });

    return res.status(201).json({
      success: true,
      message: "Chat created successfully!",
      chat,
    });
  } catch (error) {
    console.error("Create Chat Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error while creating chat.",
    });
  }
};

// Get all chats of logged-in user
const getChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      user: req.user.userId,
    }).sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      count: chats.length,
      chats,
    });
  } catch (error) {
    console.error("Get Chats Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching chats.",
    });
  }
};

// Get a particular chat
const getChatById = async (req, res) => {
  try {
    const chat = await Chat.findOne({
      _id: req.params.chatId,
      user: req.user.userId,
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found.",
      });
    }

    const messages = await Message.find({
      chat: chat._id,
    }).sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      chat,
      messages,
    });
  } catch (error) {
    console.error("Get Chat Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching chat.",
    });
  }
};

// Delete a chat
const deleteChat = async (req, res) => {
  try {
    const chat = await Chat.findOneAndDelete({
      _id: req.params.chatId,
      user: req.user.userId,
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found.",
      });
    }

    await Message.deleteMany({
      chat: chat._id,
    });

    return res.status(200).json({
      success: true,
      message: "Chat deleted successfully!",
    });
  } catch (error) {
    console.error("Delete Chat Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error while deleting chat.",
    });
  }
};

module.exports = {
  createChat,
  getChats,
  getChatById,
  deleteChat,
};
