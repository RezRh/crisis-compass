import { useAuthStore } from "@/stores/auth-store";
import { useServerStore } from "@/stores/server-store";
import { useMessageStore } from "@/stores/message-store";
import { useUIStore } from "@/stores/ui-store";
import { Plus } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export function ServerSidebar() {
  const { servers, activeServerId, setActiveServer } = useServerStore();
  const { setCreateServerOpen } = useUIStore();

  return (
    <div className="flex h-full w-[72px] flex-col items-center gap-2 bg-server-bar py-3 overflow-y-auto">
      {/* Home / DMs button */}
      <Tooltip>
        <TooltipTrigger asChild>
          <button className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-foreground transition-all hover:rounded-xl hover:bg-primary hover:text-primary-foreground">
            <svg width="28" height="20" viewBox="0 0 28 20"><path fill="currentColor" d="M23.021 1.677A21.227 21.227 0 0017.658 0c-.252.462-.483.935-.687 1.418a19.931 19.931 0 00-5.943 0A13.163 13.163 0 0010.34 0a21.227 21.227 0 00-5.365 1.677C1.29 7.692.26 13.56.82 19.35A21.39 21.39 0 007.36 20a15.773 15.773 0 001.38-2.244 13.9 13.9 0 01-2.174-1.042c.182-.132.36-.27.532-.41a15.15 15.15 0 0012.804 0c.175.14.352.278.532.41a13.94 13.94 0 01-2.178 1.044A15.862 15.862 0 0019.636 20a21.37 21.37 0 006.543-4.65c.655-6.756-1.114-12.573-4.658-17.673z" /></svg>
          </button>
        </TooltipTrigger>
        <TooltipContent side="right">Direct Messages</TooltipContent>
      </Tooltip>

      <div className="mx-auto h-[2px] w-8 rounded-full bg-border" />

      {servers.map((server) => (
        <Tooltip key={server.id}>
          <TooltipTrigger asChild>
            <button
              onClick={() => setActiveServer(server.id)}
              className={cn(
                "relative flex h-12 w-12 items-center justify-center rounded-3xl bg-accent text-foreground transition-all hover:rounded-xl hover:bg-primary hover:text-primary-foreground",
                activeServerId === server.id && "rounded-xl bg-primary text-primary-foreground"
              )}
            >
              {activeServerId === server.id && (
                <span className="absolute left-0 top-1/2 -translate-x-[2px] -translate-y-1/2 h-10 w-1 rounded-r-full bg-foreground" />
              )}
              <span className="text-sm font-semibold">{server.name.charAt(0).toUpperCase()}</span>
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">{server.name}</TooltipContent>
        </Tooltip>
      ))}

      <div className="mx-auto h-[2px] w-8 rounded-full bg-border" />

      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => setCreateServerOpen(true)}
            className="flex h-12 w-12 items-center justify-center rounded-3xl bg-accent text-discord-green transition-all hover:rounded-xl hover:bg-discord-green hover:text-primary-foreground"
          >
            <Plus className="h-5 w-5" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="right">Add a Server</TooltipContent>
      </Tooltip>
    </div>
  );
}
