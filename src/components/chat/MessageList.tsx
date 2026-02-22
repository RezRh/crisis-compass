import { useMessageStore } from "@/stores/message-store";
import { useServerStore } from "@/stores/server-store";
import { Virtuoso } from "react-virtuoso";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import { useRef } from "react";

export function MessageList() {
  const { activeChannelId } = useServerStore();
  const messages = useMessageStore((s) => (activeChannelId ? s.messages[activeChannelId] || [] : []));
  const virtuosoRef = useRef(null);

  if (!activeChannelId) {
    return (
      <div className="flex flex-1 items-center justify-center text-muted-foreground">
        Select a channel to start chatting
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center text-muted-foreground">
        No messages yet. Start the conversation!
      </div>
    );
  }

  return (
    <Virtuoso
      ref={virtuosoRef}
      data={messages}
      initialTopMostItemIndex={messages.length - 1}
      followOutput="smooth"
      className="flex-1"
      itemContent={(index, msg) => {
        const prev = index > 0 ? messages[index - 1] : null;
        const isGrouped =
          prev &&
          prev.author.id === msg.author.id &&
          new Date(msg.created_at).getTime() - new Date(prev.created_at).getTime() < 5 * 60000;

        return (
          <div className={`group flex gap-4 px-4 py-0.5 hover:bg-accent/30 ${!isGrouped ? "mt-4" : ""}`}>
            {!isGrouped ? (
              <Avatar className="mt-0.5 h-10 w-10 shrink-0">
                <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                  {msg.author.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            ) : (
              <div className="w-10 shrink-0" />
            )}
            <div className="min-w-0 flex-1">
              {!isGrouped && (
                <div className="flex items-baseline gap-2">
                  <span className="font-medium text-foreground">{msg.author.username}</span>
                  <span className="text-[11px] text-muted-foreground">
                    {format(new Date(msg.created_at), "MM/dd/yyyy h:mm a")}
                  </span>
                </div>
              )}
              <p className="text-sm text-foreground/90 leading-relaxed break-words">{msg.content}</p>
              {msg.edited_at && <span className="text-[10px] text-muted-foreground">(edited)</span>}
            </div>
          </div>
        );
      }}
    />
  );
}
