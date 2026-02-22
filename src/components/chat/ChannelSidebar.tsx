import { useServerStore } from "@/stores/server-store";
import { useAuthStore } from "@/stores/auth-store";
import { useUIStore } from "@/stores/ui-store";
import { Hash, ChevronDown, ChevronRight, Plus, Settings, Mic, Headphones, Volume2 } from "lucide-react";
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
        <div className="flex h-12 items-center border-b border-black/20 px-4 font-semibold text-foreground shadow-[0_1px_0_rgba(0,0,0,0.2)]">
          Select a server
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-60 flex-col bg-channel-bar">
      {/* Server header - Discord uses a shadow, not border */}
      <button
        onClick={() => openSettings("server")}
        className="flex h-12 items-center justify-between px-4 font-semibold text-foreground shadow-[0_1px_0_rgba(0,0,0,0.2)] transition-colors hover:bg-accent/40"
      >
        <span className="truncate text-[15px]">{activeServer.name}</span>
        <ChevronDown className="h-[18px] w-[18px] shrink-0 text-foreground" />
      </button>

      {/* Channels */}
      <div className="flex-1 overflow-y-auto px-2 pt-4 space-y-[16px]">
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

      {/* User panel - Discord's actual bottom bar */}
      <div className="flex items-center gap-2 bg-[hsl(228_6%_15%)] px-2 py-[6px]">
        <div className="relative flex-shrink-0">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
              {user?.username?.charAt(0).toUpperCase() || "?"}
            </AvatarFallback>
          </Avatar>
          <span className="absolute -bottom-0.5 -right-0.5 h-[14px] w-[14px] rounded-full border-[3px] border-[hsl(228_6%_15%)] bg-discord-green" />
        </div>
        <div className="flex-1 min-w-0 pr-1">
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
      <div className="group flex items-center justify-between pr-1">
        <CollapsibleTrigger className="flex items-center gap-[2px] text-[11px] font-bold uppercase tracking-[0.02em] text-muted-foreground hover:text-foreground transition-colors">
          <ChevronDown className={cn("h-3 w-3 transition-transform duration-150", !open && "-rotate-90")} />
          <span>{name}</span>
        </CollapsibleTrigger>
        <button onClick={onAddChannel} className="text-muted-foreground opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100">
          <Plus className="h-[18px] w-[18px]" />
        </button>
      </div>
      <CollapsibleContent className="mt-[2px] space-y-[1px]">
        {channels.map((ch) => (
          <button
            key={ch.id}
            onClick={() => onSelect(ch.id)}
            className={cn(
              "group/ch flex w-full items-center gap-[6px] rounded px-2 py-[6px] text-[15px] leading-5 transition-all duration-75",
              activeChannelId === ch.id
                ? "bg-accent/60 text-foreground"
                : "text-muted-foreground hover:bg-accent/30 hover:text-[hsl(210_9%_78%)]"
            )}
          >
            <Hash className="h-5 w-5 shrink-0 opacity-50" />
            <span className="truncate font-medium">{ch.name}</span>
          </button>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
