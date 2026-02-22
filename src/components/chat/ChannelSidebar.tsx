import { useServerStore } from "@/stores/server-store";
import { useAuthStore } from "@/stores/auth-store";
import { useUIStore } from "@/stores/ui-store";
import { Hash, ChevronDown, Plus, Settings, LogOut, Mic, Headphones } from "lucide-react";
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
        className="flex h-12 items-center justify-between border-b border-border px-4 font-semibold text-foreground shadow-sm transition-colors hover:bg-accent/50"
      >
        <span className="truncate">{activeServer.name}</span>
        <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
      </button>

      {/* Channels */}
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
      <div className="flex items-center gap-2 border-t border-border bg-server-bar/50 p-2">
        <div className="relative">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
              {user?.username?.charAt(0).toUpperCase() || "?"}
            </AvatarFallback>
          </Avatar>
          <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-channel-bar bg-discord-green" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="truncate text-sm font-medium text-foreground">{user?.username}</p>
          <p className="truncate text-[10px] text-muted-foreground">Online</p>
        </div>
        <div className="flex items-center gap-0.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
                <Mic className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Mute</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
                <Headphones className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Deafen</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <button onClick={() => openSettings("user")} className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
                <Settings className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>User Settings</TooltipContent>
          </Tooltip>
        </div>
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
        <CollapsibleTrigger className="flex items-center gap-0.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors">
          <ChevronDown className={cn("h-3 w-3 transition-transform duration-200", !open && "-rotate-90")} />
          {name}
        </CollapsibleTrigger>
        <button onClick={onAddChannel} className="rounded p-0.5 text-muted-foreground opacity-0 transition-all hover:text-foreground group-hover:opacity-100 [div:hover>&]:opacity-100">
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <CollapsibleContent className="mt-0.5 space-y-[1px]">
        {channels.map((ch) => (
          <button
            key={ch.id}
            onClick={() => onSelect(ch.id)}
            className={cn(
              "flex w-full items-center gap-1.5 rounded-md px-2 py-[6px] text-sm transition-all duration-100",
              activeChannelId === ch.id
                ? "bg-accent text-foreground font-medium"
                : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
            )}
          >
            <Hash className="h-4 w-4 shrink-0 opacity-60" />
            <span className="truncate">{ch.name}</span>
          </button>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
