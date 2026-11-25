
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const generateAIResponse = async (conversationHistory) => {
  try {
    // Convert MongoDB messages into Gemini conversation format
    const contents = conversationHistory.map((message) => ({
      role: message.sender === "assistant" ? "model" : "user",
      parts: [{ text: message.content }],
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: contents,
    });

    return response.text;

  } catch (error) {
    console.error("Gemini API Error Details:");
    console.error(error);
    console.error("Error message:", error.message);
    console.error("Error status:", error.status);

    throw new Error("Failed to generate AI response.");
  }
};

module.exports = { generateAIResponse };
