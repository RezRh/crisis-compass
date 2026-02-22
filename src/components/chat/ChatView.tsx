import { useUIStore } from "@/stores/ui-store";
import { ArrowLeft, Phone, Video, Plus, MessageSquare, Mic, Send, Camera, Image, BarChart3, FileText, Gift } from "lucide-react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
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

// Mock chat messages with dates
const mockChats: Record<string, { id: string; text: string; sender: "me" | "them"; time: string; date?: string }[]> = {
  Batwoman: [
    { id: "1", text: "Hey, did you see the new update?", sender: "them", time: "2:30 PM", date: "Wed, Feb 4" },
    { id: "2", text: "Which update?", sender: "me", time: "2:32 PM" },
    { id: "3", text: "The one they pushed last night", sender: "them", time: "2:33 PM" },
    { id: "4", text: "Oh yeah I saw the changelog", sender: "me", time: "2:35 PM" },
    { id: "5", text: "It's massive right?", sender: "them", time: "2:36 PM" },
    { id: "6", text: "Like 50 new features lol", sender: "me", time: "2:37 PM" },
    { id: "7", text: "The dark mode is 🔥", sender: "them", time: "2:38 PM", date: "Thu, Feb 5" },
    { id: "8", text: "Honestly I've been waiting for that", sender: "me", time: "2:40 PM" },
    { id: "9", text: "Same, the old theme was painful", sender: "them", time: "2:41 PM" },
    { id: "10", text: "Did you try the new keybinds?", sender: "me", time: "2:45 PM" },
    { id: "11", text: "Not yet, are they good?", sender: "them", time: "2:46 PM" },
    { id: "12", text: "Yeah way faster workflow now", sender: "me", time: "2:48 PM" },
    { id: "13", text: "I need to check those out", sender: "them", time: "3:00 PM", date: "Fri, Feb 6" },
    { id: "14", text: "Also the new search is insane", sender: "me", time: "3:02 PM" },
    { id: "15", text: "Fuzzy search?", sender: "them", time: "3:03 PM" },
    { id: "16", text: "Yeah and it's instant", sender: "me", time: "3:04 PM" },
    { id: "17", text: "No way 😂", sender: "them", time: "3:05 PM" },
    { id: "18", text: "I'm not even joking try it", sender: "me", time: "3:06 PM" },
    { id: "19", text: "Brb testing rn", sender: "them", time: "3:07 PM" },
    { id: "20", text: "Ok that's actually wild", sender: "them", time: "3:15 PM", date: "Sat, Feb 7" },
    { id: "21", text: "Told you 😎", sender: "me", time: "3:16 PM" },
    { id: "22", text: "What else did they add?", sender: "them", time: "3:20 PM" },
    { id: "23", text: "Custom themes and plugins", sender: "me", time: "3:22 PM" },
    { id: "24", text: "Plugins?? Like extensions?", sender: "them", time: "3:23 PM" },
    { id: "25", text: "Yeah you can build your own", sender: "me", time: "3:25 PM" },
    { id: "26", text: "That's actually game changing", sender: "them", time: "3:26 PM" },
    { id: "27", text: "Right? The API is clean too", sender: "me", time: "3:28 PM", date: "Sun, Feb 8" },
    { id: "28", text: "I might build something for it", sender: "them", time: "3:30 PM" },
    { id: "29", text: "Do it, I'll test it", sender: "me", time: "3:32 PM" },
    { id: "30", text: "Bet 🤝", sender: "them", time: "3:33 PM" },
    { id: "31", text: "What do you think about the new features overall?", sender: "them", time: "4:00 PM", date: "Fri, Feb 13" },
    { id: "32", text: "Pretty cool honestly", sender: "me", time: "4:02 PM" },
    { id: "33", text: "Yeah many", sender: "me", time: "4:03 PM" },
  ],
  Alice: [
    { id: "1", text: "Have you seen this repo?", sender: "them", time: "10:15 AM", date: "Mon, Feb 10" },
    { id: "2", text: "Which one?", sender: "me", time: "10:20 AM" },
    { id: "3", text: "The one with the new React patterns", sender: "them", time: "10:21 AM", date: "Tue, Feb 11" },
    { id: "4", text: "Check out this new repo", sender: "me", time: "10:25 AM" },
  ],
  Bob: [
    { id: "1", text: "Can you share that link again?", sender: "them", time: "Yesterday", date: "Wed, Feb 19" },
    { id: "2", text: "https://example.com/link", sender: "me", time: "Yesterday" },
  ],
};

const defaultMessages = [
  { id: "1", text: "Hey! 👋", sender: "them" as const, time: "Yesterday", date: "Today" },
  { id: "2", text: "Hey, what's up?", sender: "me" as const, time: "Yesterday" },
];

export function ChatView() {
  const { activeDM, setActiveDM } = useUIStore();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ id: string; text: string; sender: "me" | "them"; time: string; date?: string }[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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
  const hasText = message.trim().length > 0;

  return (
    <div ref={containerRef} className="relative flex h-full w-full flex-col bg-server-bar">
      <div className="flex flex-1 flex-col overflow-y-auto">
      {/* Header — sticky glass */}
      <div className="sticky top-0 z-10 pt-12 px-3 py-3">
        {/* Blur overlay — fades from top to middle of tiles */}
        <div
          className="pointer-events-none absolute inset-0 backdrop-blur-sm"
          style={{ maskImage: "linear-gradient(to bottom, black 60%, transparent 100%)", WebkitMaskImage: "linear-gradient(to bottom, black 60%, transparent 100%)" }}
        />
        <div className="relative flex items-center gap-3">
            <button
              onClick={() => setActiveDM(null)}
              className="flex md:hidden h-10 w-10 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.06] backdrop-blur-2xl text-muted-foreground transition-colors hover:bg-white/[0.12] hover:text-foreground"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex flex-1 items-center min-w-0 md:justify-start justify-center">
              <div className="flex items-center gap-2 rounded-full bg-white/[0.08] border border-white/[0.06] backdrop-blur-2xl px-4 py-1.5">
                <div
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
                  style={{ backgroundColor: avatarColor }}
                >
                  <span className="text-white text-xs font-semibold">{activeDM.charAt(0)}</span>
                </div>
                <div className="md:text-left text-center min-w-0">
                  <p className="text-[14px] font-semibold text-foreground truncate leading-tight">{activeDM}</p>
                  <p className="text-[11px] text-muted-foreground leading-tight">last seen recently</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.06] backdrop-blur-2xl text-muted-foreground transition-colors hover:bg-white/[0.12] hover:text-foreground">
                <Video className="h-5 w-5" />
              </button>
              <button className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.06] backdrop-blur-2xl text-muted-foreground transition-colors hover:bg-white/[0.12] hover:text-foreground">
                <Phone className="h-5 w-5" />
              </button>
            </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 px-3 py-3 pb-20">
        {messages.map((msg, i) => {
          const senderName = msg.sender === "me" ? "You" : activeDM;
          const senderColor = getAvatarColor(senderName);
          const prev = i > 0 ? messages[i - 1] : null;
          const isGrouped = prev && prev.sender === msg.sender && !msg.date;
          const showDateSeparator = msg.date;

          return (
            <div key={msg.id}>
              {showDateSeparator && (
                <div className="flex items-center gap-3 py-4">
                  <div className="flex-1 h-px bg-white/[0.08]" />
                  <span className="text-[11px] font-medium text-muted-foreground">{msg.date}</span>
                  <div className="flex-1 h-px bg-white/[0.08]" />
                </div>
              )}
              <div className={`group flex gap-3 px-1 py-[2px] transition-colors hover:bg-white/[0.04] ${!isGrouped ? "mt-3" : ""}`}>
                {!isGrouped ? (
                  <div
                    className="mt-[2px] h-8 w-8 shrink-0 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: senderColor }}
                  >
                    <span className="text-white text-xs font-semibold">{senderName.charAt(0).toUpperCase()}</span>
                  </div>
                ) : (
                  <span className="w-8 shrink-0 flex items-center justify-center">
                    <span className="text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity select-none">
                      {msg.time}
                    </span>
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  {!isGrouped && (
                    <div className="flex items-baseline gap-2">
                      <span className="text-[13px] font-medium text-foreground hover:underline cursor-pointer leading-[20px]">{senderName}</span>
                      <span className="text-[10px] text-muted-foreground select-none">{msg.time}</span>
                    </div>
                  )}
                  <p className="text-[13px] text-foreground/[0.85] leading-[1.35rem] break-words">{msg.text}</p>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
      </div>

      {/* Input — fixed bottom inside container, per-tile glass */}
      <div className="absolute bottom-0 left-0 right-0 z-10 px-3 py-3 pb-6">
        <div className="flex items-center gap-2">
          <Drawer container={containerRef.current}>
            <DrawerTrigger asChild>
              <button className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.06] backdrop-blur-2xl text-muted-foreground transition-colors hover:bg-white/[0.12] hover:text-foreground">
                <Plus className="h-5 w-5" />
              </button>
            </DrawerTrigger>
            <DrawerContent className="px-4 pb-8 pt-2">
              <div className="grid grid-cols-4 gap-4 mt-2">
                {[
                  { icon: Camera, label: "Camera" },
                  { icon: Image, label: "Photos" },
                  { icon: BarChart3, label: "Polls" },
                  { icon: FileText, label: "Files" },
                  { icon: Gift, label: "Gift" },
                ].map(({ icon: Icon, label }) => (
                  <button
                    key={label}
                    className="flex flex-col items-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.04] px-3 py-4 transition-colors hover:bg-white/[0.08]"
                  >
                    <Icon className="h-7 w-7 text-white" />
                    <span className="text-xs text-white">{label}</span>
                  </button>
                ))}
              </div>
            </DrawerContent>
          </Drawer>
          <div className="flex flex-1 items-center rounded-full border border-white/[0.08] bg-white/[0.06] backdrop-blur-2xl px-4 py-[9px]">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              placeholder="Message"
              className="flex-1 bg-transparent text-[14.5px] text-foreground placeholder:text-muted-foreground outline-none"
            />
            <div className="flex items-center gap-2 ml-2">
              {!hasText && (
                <>
                  <button className="text-muted-foreground hover:text-foreground transition-colors">
                    <MessageSquare className="h-[19px] w-[19px]" />
                  </button>
                  <button className="text-muted-foreground hover:text-foreground transition-colors">
                    <Mic className="h-[19px] w-[19px]" />
                  </button>
                </>
              )}
              {hasText && (
                <button
                  onClick={handleSend}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground transition-all hover:bg-primary/80"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
