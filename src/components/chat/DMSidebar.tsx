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
  const { openSettings, sidebarCollapsed, toggleSidebar } = useUIStore();

  return (
    <div className="relative flex h-full min-w-0 flex-1 md:w-60 md:flex-none flex-col bg-server-bar overflow-hidden">
      {/* Title with toggle */}
      <div className="flex items-center justify-between px-4 pt-12 pb-2">
        <h2 className="text-[20px] font-bold text-foreground">Messages</h2>
        <button onClick={toggleSidebar} className="hidden md:flex p-1 text-muted-foreground transition-colors hover:text-foreground">
          <PanelLeftClose className="h-5 w-5" />
        </button>
      </div>

      {/* Search + Add Friends row — liquid glass */}
      <div className="flex items-center gap-2 px-3 pb-3">
        <button className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/[0.06] bg-white/[0.04] text-muted-foreground shadow-[0_2px_10px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.04)] transition-colors hover:bg-white/[0.08] hover:text-foreground">
          <Search className="h-[18px] w-[18px]" />
        </button>
        <button className="flex h-9 min-w-0 flex-1 items-center justify-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.04] text-[13px] font-medium text-muted-foreground shadow-[0_2px_10px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.04)] transition-colors hover:bg-white/[0.08] hover:text-foreground">
          <UserPlus className="h-[16px] w-[16px] shrink-0" />
          <span className="truncate">Add Friends</span>
        </button>
      </div>

      {/* DM conversation list */}
      <div className="flex-1 overflow-y-auto">
        {mockDMs.map((dm, i) => (
          <button
            key={dm.id}
            className={`flex w-full items-center gap-3 px-3 py-[10px] transition-colors hover:bg-accent/30 ${
              i === 0 ? "bg-accent/20" : ""
            }`}
          >
            {/* Avatar with status */}
            <div className="relative shrink-0">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full"
                style={{ backgroundColor: getAvatarColor(dm.username) }}
              >
                <span className="text-white text-sm font-semibold">{dm.username.charAt(0)}</span>
              </div>
              <span className={`absolute -bottom-[1px] -right-[1px] h-[15px] w-[15px] rounded-full border-[3px] border-channel-bar ${statusColors[dm.status]}`} />
            </div>

            {/* Name + last message */}
            <div className="flex-1 min-w-0 text-left">
              <p className={`truncate text-[15px] leading-5 ${dm.bold ? "font-bold text-foreground" : "font-semibold text-foreground/90"}`}>
                {dm.username}
              </p>
              <div className="flex items-center gap-1">
                <span className={`absolute -ml-[2px] h-[6px] w-[6px] rounded-full shrink-0 ${statusColors[dm.status]}`} style={{ position: "relative", marginLeft: 0 }} />
                <p className="truncate text-[13px] text-muted-foreground leading-4">{dm.lastMessage}</p>
              </div>
            </div>

            {/* Time */}
            <span className="text-[12px] text-muted-foreground shrink-0 self-start mt-1">{dm.time}</span>
          </button>
        ))}
      </div>

      {/* Desktop user panel */}
      <div className="hidden md:flex items-center gap-2 bg-server-bar px-2 py-[6px]">
        <div className="relative flex-shrink-0">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
              {user?.username?.charAt(0).toUpperCase() || "?"}
            </AvatarFallback>
          </Avatar>
          <span className="absolute -bottom-0.5 -right-0.5 h-[14px] w-[14px] rounded-full border-[3px] border-server-bar bg-discord-green" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="truncate text-[13px] font-semibold text-foreground leading-tight">{user?.username}</p>
          <p className="truncate text-[11px] text-muted-foreground leading-tight">Online</p>
        </div>
        <div className="flex items-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="rounded p-[6px] text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground">
                <Mic className="h-[18px] w-[18px]" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Mute</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="rounded p-[6px] text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground">
                <Headphones className="h-[18px] w-[18px]" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Deafen</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <button onClick={() => openSettings("user")} className="rounded p-[6px] text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground">
                <Settings className="h-[18px] w-[18px]" />
              </button>
            </TooltipTrigger>
            <TooltipContent>User Settings</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
