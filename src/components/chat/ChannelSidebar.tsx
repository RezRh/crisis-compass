import { useServerStore } from "@/stores/server-store";
import { useAuthStore } from "@/stores/auth-store";
import { useUIStore } from "@/stores/ui-store";
import { Hash, ChevronDown, Plus, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useState } from "react";

export function ChannelSidebar() {
  const { servers, channels, activeServerId, activeChannelId, setActiveChannel } = useServerStore();
  const { user, logout } = useAuthStore();
  const { setCreateChannelOpen, openSettings } = useUIStore();

  const activeServer = servers.find((s) => s.id === activeServerId);
  const serverChannels = activeServerId ? channels[activeServerId] || [] : [];

  // Group by category
  const categories = serverChannels.reduce<Record<string, typeof serverChannels>>((acc, ch) => {
    const cat = ch.category || "Uncategorized";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(ch);
    return acc;
  }, {});

  if (!activeServer) {
    return (
      <div className="flex h-full w-60 flex-col bg-channel-bar">
        <div className="flex h-12 items-center border-b border-border px-4 font-semibold text-foreground shadow-sm">
          Select a server
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-60 flex-col bg-channel-bar">
      {/* Server header */}
      <button
        onClick={() => openSettings("server")}
        className="flex h-12 items-center justify-between border-b border-border px-4 font-semibold text-foreground shadow-sm transition-colors hover:bg-accent"
      >
        <span className="truncate">{activeServer.name}</span>
        <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
      </button>

      {/* Channel list */}
      <div className="flex-1 overflow-y-auto px-2 pt-4 space-y-4">
        {Object.entries(categories).map(([category, chans]) => (
          <ChannelCategory
            key={category}
            name={category}
            channels={chans}
            activeChannelId={activeChannelId}
            onSelect={setActiveChannel}
            onAddChannel={() => setCreateChannelOpen(true)}
          />
        ))}
      </div>

      {/* User panel */}
      <div className="flex items-center gap-2 border-t border-border bg-server-bar p-2">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
            {user?.username?.charAt(0).toUpperCase() || "?"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="truncate text-sm font-medium text-foreground">{user?.username}</p>
          <p className="truncate text-[10px] text-muted-foreground">Online</p>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <button onClick={() => openSettings("user")} className="p-1 text-muted-foreground hover:text-foreground">
              <Settings className="h-4 w-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>User Settings</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <button onClick={logout} className="p-1 text-muted-foreground hover:text-destructive">
              <LogOut className="h-4 w-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>Log Out</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}

function ChannelCategory({
  name,
  channels,
  activeChannelId,
  onSelect,
  onAddChannel,
}: {
  name: string;
  channels: { id: string; name: string }[];
  activeChannelId: string | null;
  onSelect: (id: string) => void;
  onAddChannel: () => void;
}) {
  const [open, setOpen] = useState(true);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="flex items-center justify-between pr-1">
        <CollapsibleTrigger className="flex items-center gap-0.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground hover:text-foreground">
          <ChevronDown className={cn("h-3 w-3 transition-transform", !open && "-rotate-90")} />
          {name}
        </CollapsibleTrigger>
        <button onClick={onAddChannel} className="text-muted-foreground hover:text-foreground">
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <CollapsibleContent className="mt-0.5 space-y-[2px]">
        {channels.map((ch) => (
          <button
            key={ch.id}
            onClick={() => onSelect(ch.id)}
            className={cn(
              "flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
              activeChannelId === ch.id && "bg-accent text-foreground"
            )}
          >
            <Hash className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="truncate">{ch.name}</span>
          </button>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
