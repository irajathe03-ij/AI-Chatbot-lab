
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Menu,
  Plus,
  MessageSquare,
  Trash2,
  Search,
  Settings,
  User,
  Send,
  Sparkles,
  Bot,
  PanelLeftClose,
  Paperclip,
  Mic,
  Moon,
  Sun,
} from "lucide-react";

import {
  createChat,
  getChats,
  getMessages,
  sendMessage,
  deleteChat,
} from "@/lib/api";
import { socket } from "@/lib/socket";
export default function Home() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDark, setIsDark] = useState(false);

  const [messages, setMessages] = useState<
  { role: "user" | "assistant"; content: string }[]
>([]);

const [token, setToken] = useState<string | null>(null);
const [chatId, setChatId] = useState<string | null>(null);
const [chats, setChats] = useState<any[]>([]);
const [isLoading, setIsLoading] = useState(false);
const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);
const [error, setError] = useState("");
// Socket.io connection
useEffect(() => {
  if (!token) return;

  const handleConnect = () => {
    console.log("Socket.io connected:", socket.id);
  };

  socket.on("connect", handleConnect);

  socket.connect();

  return () => {
    socket.off("connect", handleConnect);
    socket.disconnect();
  };
}, [token]);
// Join the selected chat room
useEffect(() => {
  if (!token || !chatId) return;

  socket.emit("join-chat", chatId);

  console.log("Joined chat room:", chatId);
}, [token, chatId]);

// Listen for typing indicators
useEffect(() => {
  if (!chatId) return;

  let typingTimeout: ReturnType<typeof setTimeout>;

  const handleUserTyping = () => {
    setIsOtherUserTyping(true);

    clearTimeout(typingTimeout);

    typingTimeout = setTimeout(() => {
      setIsOtherUserTyping(false);
    }, 2000);
  };

  const handleUserStopTyping = () => {
    clearTimeout(typingTimeout);
    setIsOtherUserTyping(false);
  };

  socket.on("user-typing", handleUserTyping);
  socket.on("user-stop-typing", handleUserStopTyping);

  return () => {
    clearTimeout(typingTimeout);
    socket.off("user-typing", handleUserTyping);
    socket.off("user-stop-typing", handleUserStopTyping);
    setIsOtherUserTyping(false);
  };
}, [chatId]); 

// Listen for real-time messages
useEffect(() => {
  if (!chatId) return;

  const handleNewMessage = (data: any) => {
    setMessages((prev) => {
      const newMessages = [];

      if (
        !prev.some(
          (msg) =>
            msg.role === "user" &&
            msg.content === data.userMessage.content
        )
      ) {
        newMessages.push({
          role: "user" as const,
          content: data.userMessage.content,
        });
      }

      if (
        !prev.some(
          (msg) =>
            msg.role === "assistant" &&
            msg.content === data.aiMessage.content
        )
      ) {
        newMessages.push({
          role: "assistant" as const,
          content: data.aiMessage.content,
        });
      }

      return [...prev, ...newMessages];
    });
  };

  socket.on("new-message", handleNewMessage);

  return () => {
    socket.off("new-message", handleNewMessage);
  };
}, [chatId]);

// Join the selected chat room
useEffect(() => {
  if (!token || !chatId) return;

  socket.emit("join-chat", chatId);

  console.log("Joined chat room:", chatId);
}, [token, chatId]);   
useEffect(() => {
    const savedToken = sessionStorage.getItem("token");

    if (!savedToken) {
      router.push("/login");
      return;
    }

    setToken(savedToken);
  }, [router]);

    useEffect(() => {
    if (!token) return;

    const loadChats = async () => {
      try {
        const result = await getChats(token);

setChats(result.chats);
console.log("Loaded chats:", result.chats);      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load chats."
        );
      }
    };

    loadChats();
  }, [token]);

const suggestions = [
    "Explain a programming concept",
    "Help me debug my code",
    "Write something creative",
    "Prepare me for an interview",
  ];

  const theme = isDark
    ? {
        page: "bg-[#171522] text-[#eee9f8]",
        sidebar: "bg-[#211e30] border-[#39334c]",
        header: "bg-[#211e30] border-[#39334c]",
        heading: "text-[#f2ecff]",
        text: "text-[#b6accb]",
        muted: "text-[#9489a8]",
        button: "bg-[#a58aca] hover:bg-[#b49bd8] text-[#211a30]",
        buttonSoft: "hover:bg-[#39334c] text-[#c9bddf]",
        card: "bg-[#29253a] border-[#403951] text-[#e9e1f5]",
        input: "bg-[#29253a] border-[#49415c] text-white placeholder:text-[#9388a5]",
        userBubble: "bg-[#62527f] text-white",
        aiBubble: "bg-[#292d3b] border-[#414356] text-[#eee9f8]",
        icon: "bg-[#413653] text-[#d9c7fa]",
        status: "bg-[#263d35] text-[#a8e5c5]",
      }
    : {
        page: "bg-[#faf7ff] text-[#514563]",
        sidebar: "bg-[#f3edfb] border-[#e8def3]",
        header: "bg-white/90 border-[#eee5f5]",
        heading: "text-[#514064]",
        text: "text-[#766984]",
        muted: "text-[#a398b2]",
        button: "bg-[#a58aca] hover:bg-[#9274bb] text-white",
        buttonSoft: "hover:bg-[#e9e0f3] text-[#78658e]",
        card: "bg-white border-[#eadff4] text-[#645574]",
        input: "bg-white border-[#e8def3] text-[#514563] placeholder:text-[#b1a5c0]",
        userBubble: "bg-[#dceaff] text-[#496487]",
        aiBubble: "bg-[#e1f4e9] border-[#d1eadb] text-[#47735a]",
        icon: "bg-[#e8ddf8] text-[#896bb5]",
        status: "bg-[#e3f5e9] text-[#548468]",
      };

    const handleSend = async () => {
    console.log("Send button clicked!");
console.log("Message:", message);
console.log("Token:", !!token);
console.log("Loading:", isLoading);
      if (!message.trim() || !token || isLoading) return;

  const userMessage = message.trim();

if (chatId) {
  socket.emit("stop-typing", chatId);
}

setMessage("");
setIsOtherUserTyping(false);
setError("");
setIsLoading(true);
  try {
    let activeChatId: string;

    if (chatId) {
      activeChatId = chatId;
    } else {
      const chatResult = await createChat(token);
activeChatId = chatResult.chat._id;
setChatId(activeChatId);

setChats((prev) => [chatResult.chat, ...prev]);    }

    setMessages((prev) => [
      ...prev,
      { role: "user", content: userMessage },
    ]);

    const result = await sendMessage(token, activeChatId, userMessage);

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: result.aiMessage.content,
      },
    ]);
  } catch (err) {
    setError(
      err instanceof Error ? err.message : "Failed to send message."
    );
  } finally {
    setIsLoading(false);
  }
};

const handleSelectChat = async (selectedChatId: string) => {
  if (!token) return;

  try {
    setError("");
    setChatId(selectedChatId);

    const result = await getMessages(token, selectedChatId);

    setMessages(
      result.messages.map((item: any) => ({
        role: item.sender,
        content: item.content,
      }))
    );
  } catch (err) {
    setError(
      err instanceof Error ? err.message : "Failed to load conversation."
    );
  }
};
const handleDeleteChat = async (selectedChatId: string) => {
  if (!token) return;

  const confirmed = window.confirm(
    "Are you sure you want to delete this conversation?"
  );

  if (!confirmed) return;

  try {
    await deleteChat(token, selectedChatId);

    setChats((prev) =>
      prev.filter((chat) => chat._id !== selectedChatId)
    );

    if (chatId === selectedChatId) {
      setChatId(null);
      setMessages([]);
    }
  } catch (err) {
    setError(
      err instanceof Error ? err.message : "Failed to delete conversation."
    );
  }
};
    const startNewChat = async () => {
    if (!token) return;

    try {
      setError("");
      const result = await createChat(token);

      setChatId(result.chat._id);
setChats((prev) => [result.chat, ...prev]);
setMessages([]);
setMessage("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create a new chat."
      );
    }
  };

  return (
    <main className={`flex h-screen overflow-hidden transition-colors duration-300 ${theme.page}`}>

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "flex w-[270px]" : "hidden"
        } flex-col border-r p-4 transition-all duration-300 ${theme.sidebar}`}
      >
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${theme.button}`}>
              <Sparkles size={20} />
            </div>

            <span className={`text-lg font-bold tracking-tight ${theme.heading}`}>
              AI Assistant
            </span>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className={`rounded-lg p-2 transition ${theme.buttonSoft}`}
            aria-label="Close sidebar"
          >
            <PanelLeftClose size={19} />
          </button>
        </div>

        <button
          onClick={startNewChat}
          className={`mb-5 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold shadow-sm transition ${theme.button}`}
        >
          <Plus size={19} />
          New Chat
        </button>

        <button
          className={`mb-6 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${theme.buttonSoft}`}
        >
          <Search size={18} />
          Search chats
        </button>

        <div className={`mb-3 px-2 text-xs font-semibold uppercase tracking-wider ${theme.muted}`}>
          Recent conversations
        </div>

        <div className="flex-1 space-y-1 overflow-y-auto">
  {chats.length > 0 ? (
    chats.map((chat) => (
      <div
  key={chat._id}
  className={`flex items-center gap-2 rounded-lg px-2 py-2 transition ${
    chatId === chat._id ? theme.card : theme.buttonSoft
  }`}
>
  <button
    onClick={() => handleSelectChat(chat._id)}
    className="flex min-w-0 flex-1 items-center gap-3 px-1 py-1 text-left text-sm"
  >
    <MessageSquare size={17} className="shrink-0" />

    <span className="truncate">
      {chat.title || "New Conversation"}
    </span>
  </button>

  <button
    type="button"
    onClick={() => handleDeleteChat(chat._id)}
    className="rounded-lg p-2 text-red-500 transition hover:bg-red-100"
    title="Delete conversation"
    aria-label="Delete conversation"
  >
    <Trash2 size={16} />
  </button>
</div>
    ))
  ) : (
    <p className={`px-3 py-4 text-xs ${theme.muted}`}>
      Your conversations will appear here.
    </p>
  )}
</div>
        <div className="border-t border-current/10 pt-4">
          <button
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${theme.buttonSoft}`}
          >
            <Settings size={18} />
            Settings
          </button>

          <div className="mt-2 flex items-center gap-3 rounded-xl p-3">
            <div className={`flex h-9 w-9 items-center justify-center rounded-full ${theme.icon}`}>
              <User size={19} />
            </div>

            <div>
              <p className={`text-sm font-semibold ${theme.heading}`}>
                My Account
              </p>
              <p className={`text-xs ${theme.muted}`}>
                AI Chatbot User
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <section className="flex min-w-0 flex-1 flex-col">

        {/* Header */}
        <header className={`flex h-[68px] items-center justify-between border-b px-5 transition-colors md:px-8 ${theme.header}`}>
          <div className="flex items-center gap-3">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className={`rounded-lg p-2 transition ${theme.buttonSoft}`}
                aria-label="Open sidebar"
              >
                <Menu size={21} />
              </button>
            )}

            <div>
              <h1 className={`font-semibold ${theme.heading}`}>
                AI Assistant
              </h1>
              <p className={`text-xs ${theme.text}`}>
                Your intelligent conversation partner
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              className={`flex items-center gap-2 rounded-full border border-current/10 px-3 py-2 text-xs font-medium transition ${theme.buttonSoft}`}
              aria-label={isDark ? "Switch to pastel mode" : "Switch to dark mode"}
              title={isDark ? "Switch to pastel mode" : "Switch to dark mode"}
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
              <span className="hidden sm:inline">
                {isDark ? "Pastel Mode" : "Dark Mode"}
              </span>
            </button>

            <div className={`hidden items-center gap-2 rounded-full px-3 py-2 text-xs font-medium sm:flex ${theme.status}`}>
              <span className="h-2 w-2 rounded-full bg-current" />
              Ready to chat
            </div>
          </div>
        </header>

        {/* Messages */}
        <div className="flex flex-1 flex-col overflow-y-auto">
          {error && (
  <div className="mx-auto mt-3 w-full max-w-4xl rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
    {error}
  </div>
)}


          <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-5 py-8 md:px-10">

            {messages.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center text-center">

                <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl shadow-sm ${theme.icon}`}>
                  <Bot size={34} />
                </div>

                <h2 className={`mb-3 text-3xl font-bold tracking-tight ${theme.heading}`}>
                  How can I help you today?
                </h2>

                <p className={`mb-10 max-w-lg text-sm leading-6 ${theme.text}`}>
                  Ask me anything. I can help you write code, understand
                  concepts, solve problems and explore new ideas.
                </p>

                <div className="grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
                  {suggestions.map((item, index) => {
                    const pastelCards = [
                      "bg-[#f2eafa] border-[#e5d7f5] text-[#755d91]",
                      "bg-[#fceaf0] border-[#f3d7e2] text-[#936277]",
                      "bg-[#e9f2ff] border-[#d7e6fb] text-[#59769c]",
                      "bg-[#e8f5ed] border-[#d5eadc] text-[#547c61]",
                    ];

                    const darkCards = [
                      "bg-[#342c43] border-[#514361] text-[#e0cff7]",
                      "bg-[#3c2c3b] border-[#594052] text-[#f1c9db]",
                      "bg-[#29364a] border-[#40516a] text-[#c8dcfa]",
                      "bg-[#293d35] border-[#405a4c] text-[#c6ead2]",
                    ];

                    return (
                      <button
                        key={item}
                        onClick={() => setMessage(item)}
                        className={`rounded-xl border p-4 text-left text-sm shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                          isDark ? darkCards[index] : pastelCards[index]
                        }`}
                      >
                        <Sparkles size={17} className="mb-3 opacity-80" />
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
  {messages.map((item, index) => (
    <div
      key={index}
      className={`flex gap-3 ${
        item.role === "user" ? "justify-end" : "justify-start"
      }`}
    >
      {item.role === "assistant" && (
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${theme.icon}`}
        >
          <Bot size={19} />
        </div>
      )}

      <div
        className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-6 ${
          item.role === "user"
            ? theme.userBubble
            : `border ${theme.aiBubble}`
        }`}
      >
        {item.content}
      </div>

      {item.role === "user" && (
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${theme.icon}`}
        >
          <User size={18} />
        </div>
      )}
    </div>
  ))}

{isOtherUserTyping && (
  <div className={`text-sm ${theme.muted}`}>
    Someone is typing...
  </div>
)}
  {isLoading && (
    <div className="flex items-center gap-3">
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-xl ${theme.icon}`}
      >
        <Bot size={19} />
      </div>

      <div className={`rounded-2xl border px-4 py-3 text-sm ${theme.aiBubble}`}>
        Gemini is thinking...
      </div>
    </div>
  )}
</div>
)}
</div>
</div>


{/* Message Input */}
<div
  className={`px-5 pb-6 transition-colors md:px-10 ${
    isDark ? "bg-[#171522]" : "bg-[#faf7ff]"
  }`}
>
  <div className="mx-auto max-w-4xl">
    <div
      className={`rounded-2xl border p-3 shadow-sm transition focus-within:ring-2 ${
        isDark
          ? "bg-[#29253a] border-[#49415c] focus-within:border-[#a58aca] focus-within:ring-[#a58aca]/20"
          : "bg-white border-[#e8def3] focus-within:border-[#b49bd8] focus-within:ring-[#b49bd8]/20"
      }`}
    >
      <textarea
        value={message}
        onChange={(e) => {
          const value = e.target.value;
          setMessage(value);

          if (chatId && value.trim()) {
            socket.emit("typing", chatId);
          } else if (chatId) {
            socket.emit("stop-typing", chatId);
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
        placeholder="Message your AI assistant..."
        rows={2}
        className={`w-full resize-none bg-transparent px-2 py-2 text-sm outline-none ${
          isDark
            ? "text-white placeholder:text-[#9388a5]"
            : "text-[#514563] placeholder:text-[#b1a5c0]"
        }`}
      />

      <div className="flex items-center justify-between px-1 pt-2">
        <div className={`flex items-center gap-2 ${theme.muted}`}>
          <button
            type="button"
            className={`rounded-lg p-2 transition ${theme.buttonSoft}`}
            aria-label="Attach file (coming soon)"
            title="Attach file"
          >
            <Paperclip size={18} />
          </button>

          <button
            type="button"
            className={`rounded-lg p-2 transition ${theme.buttonSoft}`}
            aria-label="Voice input (coming soon)"
            title="Voice input"
          >
            <Mic size={18} />
          </button>
        </div>

        <button
          type="button"
          onClick={handleSend}
          disabled={!message.trim() || isLoading || !token}
          className={`flex h-10 w-10 items-center justify-center rounded-xl transition disabled:cursor-not-allowed disabled:opacity-40 ${theme.button}`}
          aria-label="Send message"
        >
          <Send size={18} />
        </button>
      </div>
    </div>

    <p className={`mt-3 text-center text-xs ${theme.muted}`}>
      AI can make mistakes. Verify important information.
    </p>
  </div>
</div>
</section>
</main>
);
}
