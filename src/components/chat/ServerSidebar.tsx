import { useServerStore } from "@/stores/server-store";
import { useUIStore } from "@/stores/ui-store";
import { Plus } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export function ServerSidebar() {
  const { servers, activeServerId, setActiveServer } = useServerStore();
  const { setCreateServerOpen, mainView, setMainView } = useUIStore();

  const isHome = mainView === "dms";

  return (
    <div className="flex h-full w-[72px] flex-col items-center gap-2 bg-server-bar py-3 overflow-y-auto">
      {/* Home / DMs */}
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="group relative flex items-center">
            <span
              className={cn(
                "absolute -left-[4px] w-[4px] rounded-r-full bg-foreground transition-all duration-200",
                isHome ? "h-10" : "h-0 group-hover:h-5"
              )}
            />
            <button
              onClick={() => setMainView("dms")}
              className={cn(
                "flex h-12 w-12 items-center justify-center transition-all duration-200 active:translate-y-px",
                isHome
                  ? "rounded-[16px] bg-primary text-primary-foreground"
                  : "rounded-[24px] bg-chat-bg text-foreground hover:rounded-[16px] hover:bg-primary hover:text-primary-foreground"
              )}
            >
              <svg width="26" height="18" viewBox="0 0 28 20"><path fill="currentColor" d="M23.021 1.677A21.227 21.227 0 0017.658 0c-.252.462-.483.935-.687 1.418a19.931 19.931 0 00-5.943 0A13.163 13.163 0 0010.34 0a21.227 21.227 0 00-5.365 1.677C1.29 7.692.26 13.56.82 19.35A21.39 21.39 0 007.36 20a15.773 15.773 0 001.38-2.244 13.9 13.9 0 01-2.174-1.042c.182-.132.36-.27.532-.41a15.15 15.15 0 0012.804 0c.175.14.352.278.532.41a13.94 13.94 0 01-2.178 1.044A15.862 15.862 0 0019.636 20a21.37 21.37 0 006.543-4.65c.655-6.756-1.114-12.573-4.658-17.673z" /></svg>
            </button>
          </div>
        </TooltipTrigger>
        <TooltipContent side="right" className="font-semibold">Direct Messages</TooltipContent>
      </Tooltip>

      <div className="mx-auto h-[2px] w-8 rounded-full bg-border" />

      {servers.map((server) => {
        const isActive = mainView === "servers" && activeServerId === server.id;
        const notifCount = server.id === "s2" ? 21 : server.id === "s3" ? 3 : 0;
        const hasMention = server.id === "s2";

        return (
          <Tooltip key={server.id}>
            <TooltipTrigger asChild>
              <div className="group relative flex items-center">
                <span
                  className={cn(
                    "absolute -left-[4px] w-[4px] rounded-r-full bg-foreground transition-all duration-200",
                    isActive ? "h-10" : "h-0 group-hover:h-5"
                  )}
                />
                <button
                  onClick={() => {
                    setMainView("servers");
                    setActiveServer(server.id);
                  }}
                  className={cn(
                    "relative flex h-12 w-12 items-center justify-center transition-all duration-200 active:translate-y-px",
                    isActive
                      ? "rounded-[16px] bg-primary text-primary-foreground"
                      : "rounded-[24px] bg-chat-bg text-muted-foreground hover:rounded-[16px] hover:bg-primary hover:text-primary-foreground"
                  )}
                >
                  <span className="text-lg font-semibold">{server.name.charAt(0).toUpperCase()}</span>
                </button>
                {notifCount > 0 && (
                  <span className={cn(
                    "absolute -bottom-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full border-[3px] border-server-bar px-0.5 text-[11px] font-bold text-white",
                    hasMention ? "bg-discord-red" : "bg-discord-green"
                  )}>
                    {notifCount}
                  </span>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" className="font-semibold">{server.name}</TooltipContent>
          </Tooltip>
        );
      })}

      <div className="mx-auto h-[2px] w-8 rounded-full bg-border" />

      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => setCreateServerOpen(true)}
            className="flex h-12 w-12 items-center justify-center rounded-[24px] bg-chat-bg text-discord-green transition-all duration-200 hover:rounded-[16px] hover:bg-discord-green hover:text-white active:translate-y-px"
          >
            <Plus className="h-5 w-5" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="right" className="font-semibold">Add a Server</TooltipContent>
      </Tooltip>
    </div>
  );
}
