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
    <div className="relative px-4 pb-6 pt-0 -mt-2">
      <div className="flex items-end rounded-lg bg-chat-input">
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-l-lg text-muted-foreground transition-colors hover:text-foreground">
              <Plus className="h-6 w-6" />
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
          className="max-h-[200px] flex-1 resize-none bg-transparent py-[11px] text-[15px] leading-[1.375rem] text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
        <div className="flex shrink-0 items-center gap-[2px] px-2 py-[10px]">
          {[
            { icon: Gift, label: "Send a Gift" },
            { icon: Sticker, label: "Open Sticker Picker" },
            { icon: Smile, label: "Open Emoji Picker" },
          ].map(({ icon: Icon, label }) => (
            <Tooltip key={label}>
              <TooltipTrigger asChild>
                <button className="p-[6px] text-muted-foreground transition-colors hover:text-foreground">
                  <Icon className="h-[22px] w-[22px]" />
                </button>
              </TooltipTrigger>
              <TooltipContent>{label}</TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
    </div>
  );
}
