import { useServerStore } from "@/stores/server-store";
import { useUIStore } from "@/stores/ui-store";
import { Hash, Users, Bell, Pin, Search, Inbox, HelpCircle, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export function ChatHeader() {
  const { activeServerId, activeChannelId, channels } = useServerStore();
  const { showMemberList, toggleMemberList, sidebarCollapsed, toggleSidebar } = useUIStore();

  const serverChannels = activeServerId ? channels[activeServerId] || [] : [];
  const activeChannel = serverChannels.find((c) => c.id === activeChannelId);

  return (
    <header className="flex h-12 items-center justify-between bg-chat-bg px-4 shadow-[0_1px_0_rgba(0,0,0,0.2)]">
      <div className="flex items-center gap-2 min-w-0">
        {sidebarCollapsed && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button onClick={toggleSidebar} className="p-[6px] text-muted-foreground transition-colors hover:text-foreground">
                <PanelLeftOpen className="h-5 w-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Show Sidebar</TooltipContent>
          </Tooltip>
        )}
        <Hash className="h-6 w-6 shrink-0 text-muted-foreground" />
        <h2 className="font-bold text-[15px] text-foreground truncate">{activeChannel?.name || "Select a channel"}</h2>
        {activeChannel && (
          <>
            <div className="mx-1 h-6 w-px bg-border/50 shrink-0 hidden sm:block" />
            <p className="text-[13px] text-muted-foreground truncate hidden sm:block">Welcome to #{activeChannel.name}!</p>
          </>
        )}
      </div>
      <div className="flex items-center shrink-0">
        {[
          { icon: Bell, label: "Notification Settings" },
          { icon: Pin, label: "Pinned Messages" },
        ].map(({ icon: Icon, label }) => (
          <Tooltip key={label}>
            <TooltipTrigger asChild>
              <button className="p-[6px] text-muted-foreground transition-colors hover:text-foreground">
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
              className={cn("p-[6px] transition-colors", showMemberList ? "text-foreground" : "text-muted-foreground hover:text-foreground")}
            >
              <Users className="h-5 w-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent>{showMemberList ? "Hide Member List" : "Show Member List"}</TooltipContent>
        </Tooltip>
        <div className="ml-2 hidden lg:flex">
          <div className="flex items-center rounded bg-server-bar px-1.5 py-[3px]">
            <input
              type="text"
              placeholder="Search"
              className="w-[136px] bg-transparent text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:w-[200px] transition-all"
            />
            <Search className="h-4 w-4 text-muted-foreground ml-1" />
          </div>
        </div>
        {[
          { icon: Inbox, label: "Inbox" },
          { icon: HelpCircle, label: "Help" },
        ].map(({ icon: Icon, label }) => (
          <Tooltip key={label}>
            <TooltipTrigger asChild>
              <button className="p-[6px] text-muted-foreground transition-colors hover:text-foreground">
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
