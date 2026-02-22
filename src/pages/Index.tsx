import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { useUIStore } from "@/stores/ui-store";
import { DMSidebar } from "@/components/chat/DMSidebar";
import { ServerSidebar } from "@/components/chat/ServerSidebar";
import { SettingsOverlay } from "@/components/settings/SettingsOverlay";
import { LoginPage } from "@/pages/LoginPage";
import { Home, Bell, UserRoundPlus, ArrowLeft, Phone, Video, MoreVertical, Plus, Smile, Send } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useServerStore } from "@/stores/server-store";

const DISCORD_COLORS = [
  "hsl(235 86% 65%)", "hsl(139 47% 44%)", "hsl(38 96% 54%)",
  "hsl(0 84% 60%)", "hsl(197 100% 48%)", "hsl(326 78% 60%)",
];

function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return DISCORD_COLORS[Math.abs(hash) % DISCORD_COLORS.length];
}

// Mock DM messages per user
const mockDMMessages: Record<string, { id: string; sender: string; text: string; time: string; isMe: boolean }[]> = {
  Batwoman: [
    { id: "1", sender: "Batwoman", text: "Hey, are you free tonight?", time: "8:30 PM", isMe: false },
    { id: "2", sender: "You", text: "Yeah what's up?", time: "8:32 PM", isMe: true },
    { id: "3", sender: "Batwoman", text: "Wanna join the voice channel?", time: "8:33 PM", isMe: false },
    { id: "4", sender: "You", text: "Sure give me 5 min", time: "8:34 PM", isMe: true },
    { id: "5", sender: "Batwoman", text: "Cool, we got a few people already", time: "8:34 PM", isMe: false },
    { id: "6", sender: "You", text: "Yeah many", time: "8:35 PM", isMe: true },
  ],
  Alice: [
    { id: "1", sender: "Alice", text: "Check out this repo I found", time: "3:15 PM", isMe: false },
    { id: "2", sender: "You", text: "Oh nice, what's it about?", time: "3:20 PM", isMe: true },
    { id: "3", sender: "Alice", text: "It's a new UI framework, super lightweight", time: "3:21 PM", isMe: false },
    { id: "4", sender: "You", text: "Check out this new repo", time: "3:25 PM", isMe: true },
  ],
  Bob: [
    { id: "1", sender: "Bob", text: "Did you see the new update?", time: "11:00 AM", isMe: false },
    { id: "2", sender: "You", text: "Not yet, is it good?", time: "11:05 AM", isMe: true },
    { id: "3", sender: "You", text: "https://example.com/link", time: "11:10 AM", isMe: true },
  ],
  Charlie: [
    { id: "1", sender: "Charlie", text: "What do you think about AI?", time: "2:00 PM", isMe: false },
    { id: "2", sender: "You", text: "AI can answer almost anything because it's trained on massive datasets", time: "2:05 PM", isMe: true },
  ],
  Diana: [
    { id: "1", sender: "You", text: "Hey, need help with anything?", time: "10:00 AM", isMe: true },
    { id: "2", sender: "Diana", text: "Thanks for the help!", time: "10:15 AM", isMe: false },
  ],
};

const ChatApp = () => {
  const { isAuthenticated, user } = useAuthStore();
  const { loadMockData } = useServerStore();
  const { openSettings, sidebarCollapsed, activeDM, setActiveDM } = useUIStore();

  useEffect(() => {
    if (isAuthenticated) {
      loadMockData();
    }
  }, [isAuthenticated, loadMockData]);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="dark relative flex h-screen w-full flex-col overflow-hidden bg-server-bar text-foreground">
      <div className="flex flex-1 min-h-0 min-w-0 overflow-hidden">
        {!sidebarCollapsed && <ServerSidebar />}
        {!sidebarCollapsed && (
          <div className="flex min-w-0 flex-1 md:flex-none">
            <DMSidebar />
          </div>
        )}

        {/* DM Chat panel */}
        <div className={`flex flex-1 flex-col min-w-0 bg-chat-bg ${!sidebarCollapsed ? "hidden md:flex" : "flex"}`}>
          <DMChatView activeDM={activeDM} onBack={() => setActiveDM(null)} />
        </div>
      </div>

      {/* Mobile bottom tab bar */}
      {!sidebarCollapsed && (
        <div className="flex justify-center bg-server-bar pb-3 pt-1 md:hidden">
          <div className="flex items-center gap-3 rounded-full border border-white/[0.06] bg-white/[0.04] px-3 py-2 shadow-[0_2px_16px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.04),inset_0_-1px_4px_rgba(0,0,0,0.3)]">
            <button className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-all">
              <Home className="h-5 w-5 text-foreground" />
              <span className="absolute -top-1 -right-1 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-discord-red px-1 text-[10px] font-bold text-white">223</span>
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-full transition-all hover:bg-white/[0.04]">
              <Bell className="h-5 w-5 text-muted-foreground" />
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-full transition-all hover:bg-white/[0.04]">
              <UserRoundPlus className="h-5 w-5 text-muted-foreground" />
            </button>
            <button
              onClick={() => openSettings("user")}
              className="relative flex h-10 w-10 items-center justify-center rounded-full transition-all hover:bg-white/[0.04]"
            >
              <Avatar className="h-6 w-6">
                <AvatarFallback className="bg-primary text-primary-foreground text-[10px] font-bold">
                  {user?.username?.charAt(0).toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
              <span className="absolute bottom-0.5 right-0.5 h-[9px] w-[9px] rounded-full border-[1.5px] border-white/10 bg-discord-green" />
            </button>
          </div>
        </div>
      )}

      <SettingsOverlay />
    </div>
  );
};

function DMChatView({ activeDM, onBack }: { activeDM: string | null; onBack: () => void }) {
  const [input, setInput] = useState("");
  const dmName = activeDM || "Batwoman";
  const messages = mockDMMessages[dmName] || [];

  return (
    <>
      {/* Header */}
      <header className="flex h-12 items-center justify-between bg-chat-bg px-3 shadow-[0_1px_0_rgba(0,0,0,0.2)]">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="p-[6px] text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full"
            style={{ backgroundColor: getAvatarColor(dmName) }}
          >
            <span className="text-white text-xs font-semibold">{dmName.charAt(0)}</span>
          </div>
          <h2 className="font-bold text-[15px] text-foreground">{dmName}</h2>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-[6px] text-muted-foreground hover:text-foreground"><Phone className="h-5 w-5" /></button>
          <button className="p-[6px] text-muted-foreground hover:text-foreground"><Video className="h-5 w-5" /></button>
          <button className="p-[6px] text-muted-foreground hover:text-foreground"><MoreVertical className="h-5 w-5" /></button>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.isMe ? "justify-end" : "justify-start"}`}>
            <div className={`flex items-end gap-2 max-w-[80%] ${msg.isMe ? "flex-row-reverse" : ""}`}>
              {!msg.isMe && (
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                  style={{ backgroundColor: getAvatarColor(msg.sender) }}
                >
                  <span className="text-white text-xs font-semibold">{msg.sender.charAt(0)}</span>
                </div>
              )}
              <div
                className={`rounded-2xl px-3 py-2 text-[14px] leading-5 ${
                  msg.isMe
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-accent text-foreground rounded-bl-md"
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[10px] text-muted-foreground shrink-0 mb-0.5">{msg.time}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 px-3 py-2 bg-chat-bg">
        <button className="p-2 text-muted-foreground hover:text-foreground">
          <Plus className="h-5 w-5" />
        </button>
        <div className="flex flex-1 items-center rounded-full bg-chat-input px-4 py-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Message ${dmName}`}
            className="flex-1 bg-transparent text-[14px] text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <button className="ml-2 text-muted-foreground hover:text-foreground">
            <Smile className="h-5 w-5" />
          </button>
        </div>
        <button className="p-2 text-primary hover:text-primary/80">
          <Send className="h-5 w-5" />
        </button>
      </div>
    </>
  );
}

export default ChatApp;
