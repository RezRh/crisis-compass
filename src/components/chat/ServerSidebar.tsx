import { useServerStore } from "@/stores/server-store";
import { useUIStore } from "@/stores/ui-store";
import { Plus, MessageCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import serverIcon1 from "@/assets/server-icon-1.jpg";
import serverIcon2 from "@/assets/server-icon-2.jpg";
import serverIcon3 from "@/assets/server-icon-3.jpg";
import serverIcon4 from "@/assets/server-icon-4.jpg";

const ALL_ICONS = [serverIcon1, serverIcon2, serverIcon3, serverIcon4];

function getServerIcon(id: string) {
  // Deterministic random pick based on server id number
  const num = parseInt(id.replace("s", ""), 10) || 0;
  return ALL_ICONS[num % ALL_ICONS.length];
}

const BTN_SM = 40;
const BTN_LG = 48;

export function ServerSidebar() {
  const { servers, activeServerId, setActiveServer } = useServerStore();
  const { setCreateServerOpen, mainView, setMainView, sidebarCollapsed } = useUIStore();
  const BTN_SIZE = sidebarCollapsed ? BTN_SM : BTN_LG;

  const isHome = mainView === "dms";

  return (
    <div className={`flex h-full flex-col items-center bg-server-bar pt-12 pb-3 transition-all duration-200 ${sidebarCollapsed ? "w-[72px]" : "w-[80px]"}`}>
      {/* Glass tile — scales with sidebar state */}
      <div
        className="relative flex flex-col items-center rounded-[18px] border border-primary/30 bg-white/[0.04] backdrop-blur-md shadow-[0_2px_16px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.04),inset_0_-1px_4px_rgba(0,0,0,0.3),0_0_12px_rgba(255,0,60,0.15)] max-h-full min-h-0 overflow-hidden transition-all duration-200"
        style={{ width: sidebarCollapsed ? 55 : 64 }}
      >
        {/* Fixed DM button at top */}
        <div className="flex flex-col items-center shrink-0 pt-[7px] px-[7px]">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setMainView("dms")}
                className={cn(
                  "flex items-center justify-center rounded-[12px] transition-all duration-200 active:translate-y-px",
                  isHome ? "text-foreground bg-white/[0.08]" : "text-foreground hover:bg-white/[0.06]"
                )}
                style={{ width: BTN_SIZE, height: BTN_SIZE }}
              >
                <MessageCircle className={sidebarCollapsed ? "h-[18px] w-[18px]" : "h-[22px] w-[22px]"} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="font-semibold">Direct Messages</TooltipContent>
          </Tooltip>
          <div className="h-[2px] w-7 rounded-full bg-white/[0.06] my-1" />
        </div>

        {/* Scrollable server list */}
        <div className="flex flex-1 flex-col items-center gap-[2px] overflow-y-auto py-0.5 pl-[8px] pr-[6px] pb-[7px] scrollbar-none min-h-0">
          {servers.map((server) => {
            const isActive = mainView === "servers" && activeServerId === server.id;
            const notifCount = server.id === "s2" ? 21 : server.id === "s3" ? 3 : 0;
            const hasMention = server.id === "s2";

            return (
              <Tooltip key={server.id}>
                <TooltipTrigger asChild>
                  <div className="relative flex items-center justify-center">
                    <button
                      onClick={() => {
                        setMainView("servers");
                        setActiveServer(server.id);
                      }}
                      className={cn(
                        "relative flex items-center justify-center overflow-hidden transition-all duration-200 active:translate-y-px",
                        isActive
                          ? "text-foreground bg-white/[0.08] rounded-[12px]"
                          : "text-muted-foreground hover:bg-white/[0.06] hover:text-foreground rounded-full hover:rounded-[12px]"
                      )}
                      style={{ width: BTN_SIZE, height: BTN_SIZE }}
                    >
                      <img
                        src={getServerIcon(server.id)}
                        alt={server.name}
                        className="h-full w-full object-cover"
                      />
                    </button>
                    {notifCount > 0 && (
                      <span className={cn(
                        "absolute -bottom-0.5 -right-1 flex h-[16px] min-w-[16px] items-center justify-center rounded-full border-2 border-server-bar px-0.5 text-[9px] font-bold text-white z-20",
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

          <div className="h-[2px] w-7 rounded-full bg-white/[0.06] my-0.5" />

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setCreateServerOpen(true)}
                className="flex items-center justify-center rounded-[12px] bg-white/[0.03] text-discord-green transition-all duration-200 hover:bg-discord-green hover:text-white active:translate-y-px"
                style={{ width: BTN_SIZE, height: BTN_SIZE }}
              >
                <Plus className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="font-semibold">Add a Server</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
