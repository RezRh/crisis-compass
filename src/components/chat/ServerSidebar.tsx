import { useServerStore } from "@/stores/server-store";
import { useUIStore } from "@/stores/ui-store";
import { Plus, MessageCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export function ServerSidebar() {
  const { servers, activeServerId, setActiveServer } = useServerStore();
  const { setCreateServerOpen, mainView, setMainView } = useUIStore();

  const isHome = mainView === "dms";

  return (
    <div className="flex h-full w-[72px] flex-col items-center gap-2 bg-server-bar pt-12 py-3 overflow-y-auto">
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
                "flex h-12 w-12 items-center justify-center transition-all duration-200 active:translate-y-px border border-white/[0.06] shadow-[0_2px_10px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.04)]",
                isHome
                  ? "rounded-[16px] bg-white/[0.12] text-foreground backdrop-blur-md shadow-[0_4px_16px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)]"
                  : "rounded-[24px] bg-white/[0.04] text-foreground hover:rounded-[16px] hover:bg-white/[0.10] hover:backdrop-blur-md hover:shadow-[0_4px_16px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)]"
              )}
            >
              <MessageCircle className="h-6 w-6" />
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
                    "relative flex h-12 w-12 items-center justify-center transition-all duration-200 active:translate-y-px border border-white/[0.06] shadow-[0_2px_10px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.04)]",
                    isActive
                      ? "rounded-[16px] bg-white/[0.12] text-foreground backdrop-blur-md shadow-[0_4px_16px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)]"
                      : "rounded-[24px] bg-white/[0.04] text-muted-foreground hover:rounded-[16px] hover:bg-white/[0.10] hover:text-foreground hover:backdrop-blur-md hover:shadow-[0_4px_16px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)]"
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
            className="flex h-12 w-12 items-center justify-center rounded-[24px] border border-white/[0.06] bg-white/[0.04] text-discord-green shadow-[0_2px_10px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.04)] transition-all duration-200 hover:rounded-[16px] hover:bg-discord-green hover:text-white active:translate-y-px"
          >
            <Plus className="h-5 w-5" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="right" className="font-semibold">Add a Server</TooltipContent>
      </Tooltip>
    </div>
  );
}
