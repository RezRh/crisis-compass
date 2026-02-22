import { useMessageStore } from "@/stores/message-store";
import { useServerStore } from "@/stores/server-store";
import { Virtuoso } from "react-virtuoso";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import { useRef } from "react";
import { Hash } from "lucide-react";

// Discord-style avatar colors
const DISCORD_COLORS = [
  "hsl(235 86% 65%)", // blurple
  "hsl(139 47% 44%)", // green
  "hsl(38 96% 54%)",  // yellow
  "hsl(0 84% 60%)",   // red
  "hsl(197 100% 48%)", // cyan
  "hsl(326 78% 60%)", // fuchsia
];

function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return DISCORD_COLORS[Math.abs(hash) % DISCORD_COLORS.length];
}

export function MessageList() {
  const { activeChannelId } = useServerStore();
  const messages = useMessageStore((s) => (activeChannelId ? s.messages[activeChannelId] || [] : []));
  const virtuosoRef = useRef(null);

  const serverChannels = useServerStore((s) =>
    s.activeServerId ? s.channels[s.activeServerId] || [] : []
  );
  const activeChannel = serverChannels.find((c) => c.id === activeChannelId);

  if (!activeChannelId) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        <p>Select a channel to start chatting</p>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-[68px] w-[68px] items-center justify-center rounded-full bg-accent">
            <Hash className="h-10 w-10 text-foreground" />
          </div>
          <h3 className="text-[32px] font-bold text-foreground">Welcome to #{activeChannel?.name}</h3>
          <p className="text-muted-foreground">This is the start of the #{activeChannel?.name} channel.</p>
        </div>
      </div>
    );
  }

  return (
    <Virtuoso
      ref={virtuosoRef}
      data={messages}
      initialTopMostItemIndex={messages.length - 1}
      followOutput="smooth"
      className="h-full"
      itemContent={(index, msg) => {
        const prev = index > 0 ? messages[index - 1] : null;
        const isGrouped =
          prev &&
          prev.author.id === msg.author.id &&
          new Date(msg.created_at).getTime() - new Date(prev.created_at).getTime() < 5 * 60000;

        return (
          <div className={`group flex gap-4 px-4 py-[2px] transition-colors hover:bg-[hsl(223_7%_19%)] ${!isGrouped ? "mt-[17px]" : ""}`}>
            {!isGrouped ? (
              <div className="mt-[2px] h-10 w-10 shrink-0 rounded-full flex items-center justify-center" style={{ backgroundColor: getAvatarColor(msg.author.username) }}>
                <span className="text-white text-sm font-semibold">{msg.author.username.charAt(0).toUpperCase()}</span>
              </div>
            ) : (
              <span className="w-10 shrink-0 flex items-center justify-center">
                <span className="text-[11px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity select-none">
                  {format(new Date(msg.created_at), "h:mm a")}
                </span>
              </span>
            )}
            <div className="min-w-0 flex-1">
              {!isGrouped && (
                <div className="flex items-baseline gap-2">
                  <span className="text-[15px] font-medium text-foreground hover:underline cursor-pointer leading-[22px]">{msg.author.username}</span>
                  <span className="text-xs text-muted-foreground select-none">
                    {format(new Date(msg.created_at), "MM/dd/yyyy h:mm a")}
                  </span>
                </div>
              )}
              <p className="text-[15px] text-foreground/[0.85] leading-[1.375rem] break-words">{msg.content}</p>
              {msg.edited_at && <span className="text-[10px] text-muted-foreground select-none">(edited)</span>}
            </div>
          </div>
        );
      }}
    />
  );
}
