import { useServerStore } from "@/stores/server-store";
import { useAuthStore } from "@/stores/auth-store";
import { Search, UserPlus, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const DISCORD_COLORS = [
  "hsl(235 86% 65%)", "hsl(139 47% 44%)", "hsl(38 96% 54%)",
  "hsl(0 84% 60%)", "hsl(197 100% 48%)", "hsl(326 78% 60%)",
];

function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return DISCORD_COLORS[Math.abs(hash) % DISCORD_COLORS.length];
}

// Mock DM conversations
const mockDMs = [
  { id: "dm1", username: "Alice", status: "online" as const, lastMessage: "Hey, how's it going?", time: "2h" },
  { id: "dm2", username: "Bob", status: "idle" as const, lastMessage: "Check out this link", time: "5h" },
  { id: "dm3", username: "Charlie", status: "dnd" as const, lastMessage: "Can you review my PR?", time: "1d" },
  { id: "dm4", username: "Diana", status: "offline" as const, lastMessage: "Thanks for the help!", time: "3d" },
];

const statusColors = {
  online: "bg-discord-green",
  idle: "bg-discord-yellow",
  dnd: "bg-discord-red",
  offline: "bg-discord-grey",
};

export function DMSidebar() {
  const { user } = useAuthStore();

  return (
    <div className="flex h-full w-60 flex-col bg-channel-bar">
      {/* Search bar */}
      <div className="px-2 pt-3 pb-1">
        <button className="flex w-full items-center rounded bg-server-bar px-2 py-[5px] text-[13px] text-muted-foreground">
          Find or start a conversation
        </button>
      </div>

      {/* Navigation */}
      <div className="px-2 pt-2 space-y-[1px]">
        <button className="flex w-full items-center gap-3 rounded px-2 py-[6px] text-foreground bg-accent/40">
          <MessageSquare className="h-5 w-5 text-muted-foreground" />
          <span className="text-[15px] font-medium">Friends</span>
        </button>
      </div>

      {/* DM header */}
      <div className="flex items-center justify-between px-4 pt-5 pb-1">
        <span className="text-[11px] font-bold uppercase tracking-[0.02em] text-muted-foreground">
          Direct Messages
        </span>
        <button className="text-muted-foreground hover:text-foreground">
          <UserPlus className="h-4 w-4" />
        </button>
      </div>

      {/* DM list */}
      <div className="flex-1 overflow-y-auto px-2 space-y-[1px]">
        {mockDMs.map((dm) => (
          <button
            key={dm.id}
            className="flex w-full items-center gap-3 rounded px-2 py-[6px] transition-colors hover:bg-accent/30"
          >
            <div className="relative shrink-0">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full"
                style={{ backgroundColor: getAvatarColor(dm.username) }}
              >
                <span className="text-white text-xs font-semibold">{dm.username.charAt(0)}</span>
              </div>
              <span className={`absolute -bottom-[1px] -right-[1px] h-[14px] w-[14px] rounded-full border-[3px] border-channel-bar ${statusColors[dm.status]}`} />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="truncate text-[15px] font-medium text-muted-foreground">{dm.username}</p>
              <p className="truncate text-[12px] text-muted-foreground/70">{dm.lastMessage}</p>
            </div>
            <span className="text-[11px] text-muted-foreground shrink-0">{dm.time}</span>
          </button>
        ))}
      </div>

      {/* User panel (same as channel sidebar) */}
      <div className="flex items-center gap-2 bg-[hsl(228_6%_15%)] px-2 py-[6px]">
        <div className="relative flex-shrink-0">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
              {user?.username?.charAt(0).toUpperCase() || "?"}
            </AvatarFallback>
          </Avatar>
          <span className="absolute -bottom-0.5 -right-0.5 h-[14px] w-[14px] rounded-full border-[3px] border-[hsl(228_6%_15%)] bg-discord-green" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="truncate text-[13px] font-semibold text-foreground leading-tight">{user?.username}</p>
          <p className="truncate text-[11px] text-muted-foreground leading-tight">Online</p>
        </div>
      </div>
    </div>
  );
}
