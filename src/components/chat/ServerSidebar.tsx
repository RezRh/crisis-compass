import { useServerStore } from "@/stores/server-store";
import { useUIStore } from "@/stores/ui-store";
import { Plus, MessageCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useMemo, useRef, useEffect, useState } from "react";

export function ServerSidebar() {
  const { servers, activeServerId, setActiveServer } = useServerStore();
  const { setCreateServerOpen, mainView, setMainView } = useUIStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [bubbleTop, setBubbleTop] = useState(0);

  const isHome = mainView === "dms";

  const activeIndex = useMemo(() => {
    if (isHome) return 0;
    const idx = servers.findIndex((s) => s.id === activeServerId);
    return idx >= 0 ? idx + 1 : -1;
  }, [isHome, servers, activeServerId]);

  // Measure actual button positions for pixel-perfect bubble placement
  useEffect(() => {
    if (activeIndex < 0 || !containerRef.current) return;
    const buttons = containerRef.current.querySelectorAll("[data-server-btn]");
    const btn = buttons[activeIndex] as HTMLElement | undefined;
    if (!btn) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    setBubbleTop(btnRect.top - containerRect.top);
  }, [activeIndex, servers]);

  return (
    <div className="flex h-full w-[72px] flex-col items-center bg-server-bar py-3 overflow-visible">
      {/* Glass container */}
      <div
        ref={containerRef}
        className="relative flex flex-col items-center rounded-[22px] border border-white/[0.06] bg-white/[0.04] backdrop-blur-md shadow-[0_2px_16px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.04),inset_0_-1px_4px_rgba(0,0,0,0.3)] mx-auto w-[60px] max-h-[calc(100%-8px)] overflow-hidden"
      >
        {/* Sliding liquid glass bubble */}
        {activeIndex >= 0 && (
          <div
            className="pointer-events-none absolute left-1/2 z-0 h-[44px] w-[44px] -translate-x-1/2 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
            style={{ top: bubbleTop + 2 }}
          >
            <div className="h-full w-full rounded-[14px] bg-white/[0.10] shadow-[0_0_20px_rgba(255,255,255,0.06),inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(255,255,255,0.05)] backdrop-blur-xl border border-white/[0.12]" />
            <div className="absolute inset-0 rounded-[14px] bg-gradient-to-br from-blue-500/[0.08] via-transparent to-purple-500/[0.06]" />
          </div>
        )}

        {/* Fixed DM button at top */}
        <div className="relative z-10 flex flex-col items-center shrink-0 pt-2 px-1.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                data-server-btn
                onClick={() => setMainView("dms")}
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-[14px] transition-all duration-200 active:translate-y-px",
                  isHome ? "text-foreground" : "text-foreground hover:bg-white/[0.06]"
                )}
              >
                <MessageCircle className="h-5 w-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="font-semibold">Direct Messages</TooltipContent>
          </Tooltip>
          <div className="h-[2px] w-8 rounded-full bg-white/[0.06] my-1.5" />
        </div>

        {/* Scrollable server list */}
        <div className="relative z-10 flex flex-1 flex-col items-center gap-1 overflow-y-auto py-1 px-1.5 pb-2 scrollbar-none min-h-0">
          {servers.map((server) => {
            const isActive = mainView === "servers" && activeServerId === server.id;
            const notifCount = server.id === "s2" ? 21 : server.id === "s3" ? 3 : 0;
            const hasMention = server.id === "s2";

            return (
              <Tooltip key={server.id}>
                <TooltipTrigger asChild>
                  <div className="relative flex items-center">
                    <button
                      data-server-btn
                      onClick={() => {
                        setMainView("servers");
                        setActiveServer(server.id);
                      }}
                      className={cn(
                        "relative flex h-12 w-12 items-center justify-center rounded-[14px] transition-all duration-200 active:translate-y-px",
                        isActive
                          ? "text-foreground"
                          : "text-muted-foreground hover:bg-white/[0.06] hover:text-foreground"
                      )}
                    >
                      <span className="text-base font-semibold">{server.name.charAt(0).toUpperCase()}</span>
                    </button>
                    {notifCount > 0 && (
                      <span className={cn(
                        "absolute -bottom-0.5 -right-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-server-bar px-0.5 text-[10px] font-bold text-white z-20",
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

          <div className="h-[2px] w-8 rounded-full bg-white/[0.06] my-0.5" />

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setCreateServerOpen(true)}
                className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-white/[0.03] text-discord-green transition-all duration-200 hover:bg-discord-green hover:text-white active:translate-y-px"
              >
                <Plus className="h-5 w-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="font-semibold">Add a Server</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
