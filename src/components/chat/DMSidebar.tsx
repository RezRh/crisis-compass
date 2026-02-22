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
];

export function DMSidebar() {
  const { user } = useAuthStore();
  const { openSettings, sidebarCollapsed, toggleSidebar, setActiveDM, activeDM } = useUIStore();

  return (
    <div className="relative flex h-full min-w-0 flex-1 flex-col bg-server-bar overflow-hidden">
      {/* Title with toggle */}
      <div className="flex items-center justify-between px-4 pt-12 pb-2">
        <div className="flex items-center gap-2">
          {sidebarCollapsed && (
            <button 
              onClick={(e) => { e.stopPropagation(); toggleSidebar(); }} 
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.06] bg-white/[0.04] text-muted-foreground shadow-[0_2px_10px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.04)] transition-colors hover:bg-white/[0.08] hover:text-foreground"
            >
              <PanelLeftOpen className="h-[18px] w-[18px]" />
            </button>
          )}
          <h2 className="text-[20px] font-bold text-foreground">Messages</h2>
        </div>
        {!sidebarCollapsed && (
          <button 
            onClick={(e) => { e.stopPropagation(); toggleSidebar(); }} 
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.06] bg-white/[0.04] text-muted-foreground shadow-[0_2px_10px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.04)] transition-colors hover:bg-white/[0.08] hover:text-foreground"
          >
            <PanelLeftClose className="h-[18px] w-[18px]" />
          </button>
        )}
      </div>

      {/* Top action row — just Add Friends now */}
      <div className="flex items-center gap-2 px-3 pt-1 pb-4">
        <button className="flex h-9 min-w-0 flex-1 items-center justify-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.04] text-[13px] font-medium text-muted-foreground shadow-[0_2px_10px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.04)] transition-colors hover:bg-white/[0.08] hover:text-foreground">
          <UserPlus className="h-[16px] w-[16px] shrink-0" />
          <span className="truncate">Add Friends</span>
        </button>
      </div>

      {/* DM conversation list */}
      <div className="flex-1 overflow-y-auto pb-20">
        {mockDMs.map((dm, i) => (
          <div key={dm.id}>
            <button
              onClick={() => setActiveDM(dm.username)}
              className={`flex w-full items-center gap-4 px-4 py-3 transition-colors hover:bg-accent/30 ${
                activeDM === dm.username ? "bg-accent/20" : ""
              }`}
            >
              {/* Avatar with status */}
              <div className="relative shrink-0">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full"
                  style={{ backgroundColor: getAvatarColor(dm.username) }}
                >
                  <span className="text-white text-base font-semibold">{dm.username.charAt(0)}</span>
                </div>
                <span className={`absolute -bottom-[1px] -right-[1px] h-[15px] w-[15px] rounded-full border-[3px] border-channel-bar ${statusColors[dm.status]}`} />
              </div>

              {/* Name + last message */}
              <div className="flex-1 min-w-0 text-left">
                <p className={`truncate text-[16px] leading-6 ${dm.bold ? "font-bold text-foreground" : "font-semibold text-foreground/90"}`}>
                  {dm.username}
                </p>
                <div className="flex items-center gap-1">
                  <p className="truncate text-[13px] text-muted-foreground leading-4">{dm.lastMessage}</p>
                </div>
              </div>

              {/* Time */}
              <span className="text-[12px] text-muted-foreground shrink-0 self-start mt-1">{dm.time}</span>
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
