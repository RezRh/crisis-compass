import { useUIStore } from "@/stores/ui-store";
import { ArrowLeft, Phone, Video, MoreVertical, Send, Smile, Paperclip } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const DISCORD_COLORS = [
  "hsl(235 86% 65%)", "hsl(139 47% 44%)", "hsl(38 96% 54%)",
  "hsl(0 84% 60%)", "hsl(197 100% 48%)", "hsl(326 78% 60%)",
];

function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return DISCORD_COLORS[Math.abs(hash) % DISCORD_COLORS.length];
}

// Mock chat messages
const mockChats: Record<string, { id: string; text: string; sender: "me" | "them"; time: string }[]> = {
  Batwoman: [
    { id: "1", text: "Hey, did you see the new update?", sender: "them", time: "2:30 PM" },
    { id: "2", text: "Yeah I checked it out", sender: "me", time: "2:32 PM" },
    { id: "3", text: "What do you think about the new features?", sender: "them", time: "2:33 PM" },
    { id: "4", text: "Pretty cool honestly", sender: "me", time: "2:35 PM" },
    { id: "5", text: "The dark mode is 🔥", sender: "them", time: "2:35 PM" },
    { id: "6", text: "Yeah many", sender: "me", time: "2:36 PM" },
  ],
  Alice: [
    { id: "1", text: "Have you seen this repo?", sender: "them", time: "10:15 AM" },
    { id: "2", text: "Which one?", sender: "me", time: "10:20 AM" },
    { id: "3", text: "The one with the new React patterns", sender: "them", time: "10:21 AM" },
    { id: "4", text: "Check out this new repo", sender: "me", time: "10:25 AM" },
  ],
  Bob: [
    { id: "1", text: "Can you share that link again?", sender: "them", time: "Yesterday" },
    { id: "2", text: "https://example.com/link", sender: "me", time: "Yesterday" },
  ],
};

// Default messages for DMs without specific mock data
const defaultMessages = [
  { id: "1", text: "Hey! 👋", sender: "them" as const, time: "Yesterday" },
  { id: "2", text: "Hey, what's up?", sender: "me" as const, time: "Yesterday" },
];

export function ChatView() {
  const { activeDM, setActiveDM } = useUIStore();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ id: string; text: string; sender: "me" | "them"; time: string }[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeDM) {
      setMessages(mockChats[activeDM] || defaultMessages);
    }
  }, [activeDM]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!message.trim()) return;
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessages((prev) => [...prev, { id: Date.now().toString(), text: message, sender: "me", time }]);
    setMessage("");
  };

  if (!activeDM) return null;

  const avatarColor = getAvatarColor(activeDM);

  return (
    <div className="flex h-full w-full flex-col bg-server-bar">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-white/[0.06] bg-server-bar px-4 py-3 pt-12">
        <button
          onClick={() => setActiveDM(null)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.06] bg-white/[0.04] text-muted-foreground shadow-[0_2px_10px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.04)] transition-colors hover:bg-white/[0.08] hover:text-foreground"
        >
          <ArrowLeft className="h-[18px] w-[18px]" />
        </button>
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
          style={{ backgroundColor: avatarColor }}
        >
          <span className="text-white text-sm font-semibold">{activeDM.charAt(0)}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[15px] font-semibold text-foreground truncate">{activeDM}</p>
          <p className="text-[12px] text-muted-foreground">Online</p>
        </div>
        <div className="flex items-center gap-1">
          <button className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground">
            <Phone className="h-[18px] w-[18px]" />
          </button>
          <button className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground">
            <Video className="h-[18px] w-[18px]" />
          </button>
          <button className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground">
            <MoreVertical className="h-[18px] w-[18px]" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
        {messages.map((msg, i) => {
          const isMe = msg.sender === "me";
          const showTail =
            i === messages.length - 1 || messages[i + 1]?.sender !== msg.sender;

          return (
            <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div
                className={`relative max-w-[75%] px-3 py-2 ${
                  isMe
                    ? "bg-primary/80 text-primary-foreground rounded-2xl rounded-br-md"
                    : "bg-white/[0.08] text-foreground rounded-2xl rounded-bl-md"
                } ${showTail ? "" : isMe ? "rounded-br-2xl" : "rounded-bl-2xl"}`}
              >
                <p className="text-[14px] leading-relaxed break-words">{msg.text}</p>
                <p
                  className={`text-[10px] mt-1 text-right ${
                    isMe ? "text-white/60" : "text-muted-foreground"
                  }`}
                >
                  {msg.time}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-white/[0.06] bg-server-bar px-3 py-3 pb-6">
        <div className="flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.04] px-3 py-2 shadow-[0_2px_10px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.04)]">
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <Smile className="h-5 w-5" />
          </button>
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <Paperclip className="h-5 w-5" />
          </button>
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder="Message..."
            className="flex-1 bg-transparent text-[14px] text-foreground placeholder:text-muted-foreground outline-none"
          />
          <button
            onClick={handleSend}
            disabled={!message.trim()}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground transition-all disabled:opacity-30 hover:bg-primary/80"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
