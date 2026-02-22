import { useState, useCallback, useRef } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { useUIStore } from "@/stores/ui-store";
import { Search, UserPlus, Mic, Headphones, Settings, Home, Bell, User, UserRoundPlus, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const DISCORD_COLORS = [
  "hsl(235 86% 65%)", "hsl(139 47% 44%)", "hsl(38 96% 54%)",
  "hsl(0 84% 60%)", "hsl(197 100% 48%)", "hsl(326 78% 60%)",
];

function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return DISCORD_COLORS[Math.abs(hash) % DISCORD_COLORS.length];
}

const statusColors = {
  online: "bg-discord-green",
  idle: "bg-discord-yellow",
  dnd: "bg-discord-red",
  offline: "bg-discord-grey",
};

// More realistic mock DMs matching screenshot style
const mockDMs = [
  { id: "dm1", username: "Batwoman", status: "offline" as const, lastMessage: "You: Yeah many", time: "2h", bold: true },
  { id: "dm2", username: "Alice", status: "online" as const, lastMessage: "You: Check out this new repo", time: "5h", bold: false },
  { id: "dm3", username: "Bob", status: "idle" as const, lastMessage: "You: https://example.com/link", time: "21h", bold: false },
  { id: "dm4", username: "Charlie", status: "dnd" as const, lastMessage: "You: AI can answer almost anything because it's train...", time: "25d", bold: false },
  { id: "dm5", username: "Diana", status: "offline" as const, lastMessage: "Diana: Thanks for the help!", time: "27d", bold: false },
  { id: "dm6", username: "JohnnyTheRock", status: "offline" as const, lastMessage: "You: Tai new link", time: "1mo", bold: false },
  { id: "dm7", username: "Jamal The IV", status: "offline" as const, lastMessage: "You: See all pages top to down", time: "1mo", bold: false },
  { id: "dm8", username: "sheyow", status: "offline" as const, lastMessage: "sheyow: throw yo mf pc", time: "3mo", bold: false },
  { id: "dm9", username: "Marcus", status: "online" as const, lastMessage: "Marcus: Let's ship it 🚀", time: "3mo", bold: false },
  { id: "dm10", username: "Lena", status: "idle" as const, lastMessage: "You: I'll send the designs later", time: "4mo", bold: false },
  { id: "dm11", username: "Kai", status: "offline" as const, lastMessage: "Kai: That bug is fixed now", time: "4mo", bold: false },
  { id: "dm12", username: "Priya", status: "dnd" as const, lastMessage: "You: Can you review this PR?", time: "5mo", bold: false },
  { id: "dm13", username: "Zane", status: "offline" as const, lastMessage: "Zane: gg wp", time: "5mo", bold: false },
  { id: "dm14", username: "Mira", status: "online" as const, lastMessage: "You: The API is working now", time: "6mo", bold: false },
  { id: "dm15", username: "Oscar", status: "offline" as const, lastMessage: "Oscar: Thanks for the invite!", time: "6mo", bold: false },
  { id: "dm16", username: "Freya", status: "idle" as const, lastMessage: "You: Check the new dashboard", time: "7mo", bold: false },
  { id: "dm17", username: "Dante", status: "offline" as const, lastMessage: "Dante: I'll be online later", time: "8mo", bold: false },
  { id: "dm18", username: "Nova", status: "offline" as const, lastMessage: "You: That was hilarious 😂", time: "9mo", bold: false },
];

export function DMSidebar() {
  const { user } = useAuthStore();
  const { openSettings, sidebarCollapsed, toggleSidebar, setActiveDM, activeDM } = useUIStore();
  const [scrolled, setScrolled] = useState(false);
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrolled(e.currentTarget.scrollTop > 10);
  }, []);

  return (
    <div className="relative flex h-full min-w-0 flex-1 flex-col bg-server-bar overflow-y-auto" onScroll={handleScroll}>
      <div className="sticky top-0 z-10">
        <div className={`h-12 transition-all duration-75 backdrop-blur-sm ${scrolled ? "backdrop-blur-md bg-white/[0.02]" : "bg-white/[0.01]"}`} />
        <div className="flex items-center justify-between px-4 pb-2">
          <div className="flex items-center gap-2">
            {sidebarCollapsed && (
              <button 
                onClick={(e) => { e.stopPropagation(); toggleSidebar(); }} 
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.06] bg-white/[0.04] backdrop-blur-2xl text-muted-foreground shadow-[0_2px_10px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.04)] transition-colors hover:bg-white/[0.08] hover:text-foreground"
              >
                <PanelLeftOpen className="h-[18px] w-[18px]" />
              </button>
            )}
            <h2 className="text-[20px] font-bold text-foreground">Messages</h2>
          </div>
          {!sidebarCollapsed && (
            <button 
              onClick={(e) => { e.stopPropagation(); toggleSidebar(); }} 
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.06] bg-white/[0.04] backdrop-blur-2xl text-muted-foreground shadow-[0_2px_10px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.04)] transition-colors hover:bg-white/[0.08] hover:text-foreground"
            >
              <PanelLeftClose className="h-[18px] w-[18px]" />
            </button>
          )}
        </div>

        {/* Add Friends — glass refraction */}
        <div className="flex items-center gap-2 px-3 pt-1 pb-4">
          <button className="flex h-9 min-w-0 flex-1 items-center justify-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.04] backdrop-blur-2xl text-[13px] font-medium text-muted-foreground shadow-[0_2px_10px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.04)] transition-colors hover:bg-white/[0.08] hover:text-foreground">
            <UserPlus className="h-[16px] w-[16px] shrink-0" />
            <span className="truncate">Add Friends</span>
          </button>
        </div>
      </div>

      {/* DM conversation list */}
      <div className="pb-20">
        {mockDMs.map((dm, i) => (
          <div key={dm.id}>
            <button
              onClick={() => setActiveDM(dm.username)}
              className={`flex w-full items-center gap-3 px-4 transition-colors hover:bg-accent/30 ${
                activeDM === dm.username ? "bg-accent/20" : ""
              } ${sidebarCollapsed ? "py-3" : "py-2"}`}
            >
              {/* Avatar with status */}
              <div className="relative shrink-0">
                <div
                  className={`flex items-center justify-center rounded-full transition-all duration-200 ${sidebarCollapsed ? "h-12 w-12" : "h-9 w-9"}`}
                  style={{ backgroundColor: getAvatarColor(dm.username) }}
                >
                  <span className={`text-white font-semibold ${sidebarCollapsed ? "text-base" : "text-sm"}`}>{dm.username.charAt(0)}</span>
                </div>
                <span className={`absolute rounded-full border-channel-bar ${sidebarCollapsed ? "-bottom-[1px] -right-[1px] h-[15px] w-[15px] border-[3px]" : "-bottom-[1px] -right-[1px] h-[11px] w-[11px] border-2"} ${statusColors[dm.status]}`} />
              </div>

              {/* Name + last message */}
              <div className="flex-1 min-w-0 text-left">
                <p className={`truncate leading-5 ${sidebarCollapsed ? "text-[16px]" : "text-[14px]"} ${dm.bold ? "font-bold text-foreground" : "font-semibold text-foreground/90"}`}>
                  {dm.username}
                </p>
                <div className="flex items-center gap-1">
                  <p className={`truncate text-muted-foreground leading-4 ${sidebarCollapsed ? "text-[13px]" : "text-[12px]"}`}>{dm.lastMessage}</p>
                </div>
              </div>

              {/* Time */}
              <span className={`text-muted-foreground shrink-0 self-start mt-1 ${sidebarCollapsed ? "text-[12px]" : "text-[11px]"}`}>{dm.time}</span>
            </button>
            {i < mockDMs.length - 1 && (
              <div className="mx-4 border-b border-white/[0.06]" />
            )}
          </div>
        ))}
      </div>

    </div>
  );
}
