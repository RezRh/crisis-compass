import { useState, useRef, KeyboardEvent } from "react";
import { useMessageStore } from "@/stores/message-store";
import { useAuthStore } from "@/stores/auth-store";
import { useServerStore } from "@/stores/server-store";
import { Plus, Smile, Send } from "lucide-react";
import { cn } from "@/lib/utils";

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

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
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
    <div className="px-4 pb-6 pt-1">
      <div className="flex items-end gap-2 rounded-lg bg-chat-input px-4 py-2">
        <button className="mb-1 text-muted-foreground hover:text-foreground">
          <Plus className="h-5 w-5" />
        </button>
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          placeholder={`Message #${activeChannel?.name || "channel"}`}
          rows={1}
          className="max-h-[200px] flex-1 resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
        <button className="mb-1 text-muted-foreground hover:text-foreground">
          <Smile className="h-5 w-5" />
        </button>
        {content.trim() && (
          <button onClick={handleSend} className="mb-1 text-primary hover:text-primary/80">
            <Send className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}
