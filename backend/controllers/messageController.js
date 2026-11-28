
const Chat = require("../models/Chat");
const Message = require("../models/Message");
const { generateAIResponse } = require("../services/aiService");

// Send user message and generate AI response
const sendMessage = async (req, res) => {
  try {
    const { content } = req.body;
    const { chatId } = req.params;

    if (!content || typeof content !== "string" || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message content is required.",
      });
    }

    // Verify chat ownership
    const chat = await Chat.findOne({
      _id: chatId,
      user: req.user.userId,
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found.",
      });
    }

    // Save the current user message
    const userMessage = await Message.create({
      chat: chat._id,
      sender: "user",
      content: content.trim(),
    });

    // Generate chat title from the first user message
if (chat.title === "New Chat" || chat.title === "New Conversation") {
  chat.title = content.trim().slice(0, 40);
  await chat.save();
}

    // Fetch recent conversation history
    const previousMessages = await Message.find({
      chat: chat._id,
    })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    // Restore chronological order
    const conversationHistory = previousMessages.reverse();

    // Generate AI response using conversation history
    const aiResponse = await generateAIResponse(
      conversationHistory
    );

    // Save AI response
    const aiMessage = await Message.create({
      chat: chat._id,
      sender: "assistant",
      content: aiResponse,
    });

    // Update chat activity
    chat.updatedAt = new Date();
    await chat.save();

// Broadcast messages to users in the same chat room
const io = req.app.get("io");

if (io) {
  io.to(chat._id.toString()).emit("new-message", {
    userMessage,
    aiMessage,
  });
}

    return res.status(201).json({
      success: true,
      message: "AI response generated successfully!",
      userMessage,
      aiMessage,
    });

  } catch (error) {
    console.error("Send Message Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to process message. Please try again.",
    });
  }
};

// Get all messages from a particular chat
const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findOne({
      _id: chatId,
      user: req.user.userId,
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found.",
      });
    }

    const messages = await Message.find({ chat: chatId })
      .sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      count: messages.length,
      messages,
    });

  } catch (error) {
    console.error("Get Messages Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching messages.",
    });
  }
};

module.exports = { sendMessage, getMessages };
