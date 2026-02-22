import { useServerStore } from "@/stores/server-store";
import { useUIStore } from "@/stores/ui-store";
import { Hash, Users, Bell, Pin, Search, Inbox, HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function ChatHeader() {
  const { activeServerId, activeChannelId, channels } = useServerStore();
  const { showMemberList, toggleMemberList } = useUIStore();

  const serverChannels = activeServerId ? channels[activeServerId] || [] : [];
  const activeChannel = serverChannels.find((c) => c.id === activeChannelId);

  return (
    <header className="flex h-12 items-center justify-between border-b border-border bg-header-bar px-4 shadow-sm">
      <div className="flex items-center gap-2">
        <Hash className="h-5 w-5 text-muted-foreground" />
        <span className="font-semibold text-foreground">{activeChannel?.name || "Select a channel"}</span>
        {activeChannel && (
          <>
            <div className="mx-2 h-6 w-px bg-border" />
            <span className="text-sm text-muted-foreground hidden sm:inline">Welcome to #{activeChannel.name}!</span>
          </>
        )}
      </div>
      <div className="flex items-center gap-0.5">
        {[
          { icon: Bell, label: "Notifications" },
          { icon: Pin, label: "Pinned Messages" },
        ].map(({ icon: Icon, label }) => (
          <Tooltip key={label}>
            <TooltipTrigger asChild>
              <button className="rounded p-1.5 text-muted-foreground transition-colors hover:text-foreground">
                <Icon className="h-5 w-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent>{label}</TooltipContent>
          </Tooltip>
        ))}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={toggleMemberList}
              className={`rounded p-1.5 transition-colors ${showMemberList ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              <Users className="h-5 w-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent>Member List</TooltipContent>
        </Tooltip>
        <div className="ml-1 hidden md:block">
          <div className="flex items-center rounded-md bg-input px-2 py-1">
            <input
              type="text"
              placeholder="Search"
              className="w-28 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        {[
          { icon: Inbox, label: "Inbox" },
          { icon: HelpCircle, label: "Help" },
        ].map(({ icon: Icon, label }) => (
          <Tooltip key={label}>
            <TooltipTrigger asChild>
              <button className="rounded p-1.5 text-muted-foreground transition-colors hover:text-foreground">
                <Icon className="h-5 w-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent>{label}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </header>
  );
}
