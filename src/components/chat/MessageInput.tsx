import { useState, useRef, KeyboardEvent } from "react";
import { useMessageStore } from "@/stores/message-store";
import { useAuthStore } from "@/stores/auth-store";
import { useServerStore } from "@/stores/server-store";
import { Plus, Smile, Gift, Sticker, Send } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function MessageInput() {
  const [content, setContent] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { activeChannelId } = useServerStore();
  const { user } = useAuthStore();
  const { addMessage } = useMessageStore();

  const serverChannels = useServerStore((s) =>
    s.activeServerId ? s.channels[s.activeServerId] || [] : []
  );
  const activeChannel = serverChannels.find((c) => c.id === activeChannelId);

  const handleSend = () => {
    if (!content.trim() || !activeChannelId || !user) return;
    addMessage({
      id: `msg-${Date.now()}`,
      channel_id: activeChannelId,
      author: user,
      content: content.trim(),
      edited_at: null,
      created_at: new Date().toISOString(),
    });
    setContent("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 200) + "px";
    }
  };

  if (!activeChannelId) return null;

  return (
    <div className="px-4 pb-6 pt-0">
      <div className="flex items-end gap-0 rounded-lg bg-chat-input ring-1 ring-border/50">
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="flex h-11 w-11 shrink-0 items-center justify-center text-muted-foreground transition-colors hover:text-foreground">
              <Plus className="h-5 w-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent>Upload a File</TooltipContent>
        </Tooltip>
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          placeholder={`Message #${activeChannel?.name || "channel"}`}
          rows={1}
          className="max-h-[200px] flex-1 resize-none bg-transparent py-[10px] text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
        <div className="flex shrink-0 items-center gap-0.5 px-2 pb-[6px]">
          {[
            { icon: Gift, label: "Send a Gift" },
            { icon: Sticker, label: "Stickers" },
            { icon: Smile, label: "Emoji" },
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
          {content.trim() && (
            <button onClick={handleSend} className="ml-1 rounded-md bg-primary p-1.5 text-primary-foreground transition-colors hover:bg-primary/80">
              <Send className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
