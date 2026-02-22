import { useServerStore } from "@/stores/server-store";
import { useUIStore } from "@/stores/ui-store";
import { Hash, Users } from "lucide-react";

export function ChatHeader() {
  const { channels, activeServerId, activeChannelId } = useServerStore();
  const { toggleMemberList, showMemberList } = useUIStore();

  const serverChannels = activeServerId ? channels[activeServerId] || [] : [];
  const activeChannel = serverChannels.find((c) => c.id === activeChannelId);

  return (
    <header className="flex h-12 items-center justify-between border-b border-border bg-chat-bg px-4 shadow-sm">
      <div className="flex items-center gap-2">
        <Hash className="h-5 w-5 text-muted-foreground" />
        <h2 className="font-semibold text-foreground">{activeChannel?.name || "Select a channel"}</h2>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={toggleMemberList}
          className={`p-1.5 rounded transition-colors ${showMemberList ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
        >
          <Users className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
