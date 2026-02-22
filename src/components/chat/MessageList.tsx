import { useMessageStore } from "@/stores/message-store";
import { useServerStore } from "@/stores/server-store";
import { Virtuoso } from "react-virtuoso";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import { useRef } from "react";

// Generate consistent avatar colors from username
function avatarColor(name: string) {
  const colors = [
    "bg-red-500", "bg-orange-500", "bg-amber-500", "bg-emerald-500",
    "bg-cyan-500", "bg-blue-500", "bg-violet-500", "bg-pink-500",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

export function MessageList() {
  const { activeChannelId } = useServerStore();
  const messages = useMessageStore((s) => (activeChannelId ? s.messages[activeChannelId] || [] : []));
  const virtuosoRef = useRef(null);

  if (!activeChannelId) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-accent">
            <span className="text-3xl">💬</span>
          </div>
          <p className="text-lg font-medium text-foreground">Select a channel</p>
          <p className="text-sm text-muted-foreground">Pick a channel to start chatting</p>
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-accent">
            <span className="text-3xl">🎉</span>
          </div>
          <p className="text-lg font-medium text-foreground">Welcome!</p>
          <p className="text-sm text-muted-foreground">This is the beginning of this channel.</p>
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
          <div className={`group flex gap-4 px-4 py-0.5 transition-colors hover:bg-accent/20 ${!isGrouped ? "mt-[17px]" : ""}`}>
            {!isGrouped ? (
              <Avatar className="mt-0.5 h-10 w-10 shrink-0">
                <AvatarFallback className={`${avatarColor(msg.author.username)} text-white text-sm font-bold`}>
                  {msg.author.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            ) : (
              <span className="w-10 shrink-0 flex items-center justify-center">
                <span className="text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                  {format(new Date(msg.created_at), "h:mm")}
                </span>
              </span>
            )}
            <div className="min-w-0 flex-1">
              {!isGrouped && (
                <div className="flex items-baseline gap-2">
                  <span className="font-medium text-foreground hover:underline cursor-pointer">{msg.author.username}</span>
                  <span className="text-[11px] text-muted-foreground">
                    {format(new Date(msg.created_at), "MM/dd/yyyy h:mm a")}
                  </span>
                </div>
              )}
              <p className="text-[15px] text-foreground/90 leading-[1.375rem] break-words">{msg.content}</p>
              {msg.edited_at && <span className="text-[10px] text-muted-foreground">(edited)</span>}
            </div>
          </div>
        );
      }}
    />
  );
}
