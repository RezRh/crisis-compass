import { useServerStore } from "@/stores/server-store";
import { useUIStore } from "@/stores/ui-store";
import { Plus, MessageCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useMemo, useRef, useEffect, useState, useCallback } from "react";

const BTN_SIZE = 40;

export function ServerSidebar() {
  const { servers, activeServerId, setActiveServer } = useServerStore();
  const { setCreateServerOpen, mainView, setMainView } = useUIStore();
  const tileRef = useRef<HTMLDivElement>(null);
  const [bubbleOffset, setBubbleOffset] = useState<number>(0);

  const isHome = mainView === "dms";

  const activeIndex = useMemo(() => {
    if (isHome) return 0;
    const idx = servers.findIndex((s) => s.id === activeServerId);
    return idx >= 0 ? idx + 1 : -1;
  }, [isHome, servers, activeServerId]);

  const recalcBubble = useCallback(() => {
    if (activeIndex < 0 || !tileRef.current) return;
    const buttons = tileRef.current.querySelectorAll<HTMLElement>("[data-srv]");
    const btn = buttons[activeIndex];
    if (!btn) return;
    const tileRect = tileRef.current.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    setBubbleOffset(btnRect.top - tileRect.top);
  }, [activeIndex]);

  useEffect(() => { recalcBubble(); }, [recalcBubble, servers]);

  const onScroll = useCallback(() => recalcBubble(), [recalcBubble]);

  return (
    <div className="flex h-full w-[72px] flex-col items-center bg-server-bar">
      {/* Fixed chat button — aligned with "Messages" heading (pt-12 = 48px) */}
      <div className="shrink-0 flex flex-col items-center pt-12 pb-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => setMainView("dms")}
              className={cn(
                "flex items-center justify-center rounded-[12px] transition-all duration-200 active:translate-y-px border border-white/[0.06] backdrop-blur-md shadow-[0_2px_10px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.04)]",
                isHome
                  ? "bg-white/[0.12] text-foreground shadow-[0_4px_16px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)]"
                  : "bg-white/[0.04] text-foreground hover:bg-white/[0.10]"
              )}
              style={{ width: BTN_SIZE, height: BTN_SIZE }}
            >
              <MessageCircle className="h-[18px] w-[18px]" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" className="font-semibold">Direct Messages</TooltipContent>
        </Tooltip>
      </div>

      {/* Glass tile for servers — scrollable */}
      <div
        ref={tileRef}
        className="relative flex flex-col items-center rounded-[18px] border border-white/[0.06] bg-white/[0.04] backdrop-blur-md shadow-[0_2px_16px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.04),inset_0_-1px_4px_rgba(0,0,0,0.3)] w-[52px] flex-1 min-h-0 overflow-hidden mt-1"
      >
        {/* Sliding liquid glass bubble — index 0 is first server now */}
        {activeIndex > 0 && (
          <div
            className="pointer-events-none absolute left-1/2 z-0 -translate-x-1/2 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
            style={{ top: bubbleOffset, width: BTN_SIZE, height: BTN_SIZE }}
          >
            <div className="h-full w-full rounded-[12px] bg-white/[0.10] shadow-[0_0_20px_rgba(255,255,255,0.06),inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(255,255,255,0.05)] backdrop-blur-xl border border-white/[0.12]" />
            <div className="absolute inset-0 rounded-[12px] bg-gradient-to-br from-blue-500/[0.08] via-transparent to-purple-500/[0.06]" />
          </div>
        )}

        <div
          onScroll={onScroll}
          className="relative z-10 flex flex-1 flex-col items-center gap-[2px] overflow-y-auto p-[6px] scrollbar-none min-h-0"
        >
          {servers.map((server) => {
            const isActive = mainView === "servers" && activeServerId === server.id;
            const notifCount = server.id === "s2" ? 21 : server.id === "s3" ? 3 : 0;
            const hasMention = server.id === "s2";

            return (
              <Tooltip key={server.id}>
                <TooltipTrigger asChild>
                  <div className="relative flex items-center justify-center">
                    <button
                      data-srv
                      onClick={() => {
                        setMainView("servers");
                        setActiveServer(server.id);
                      }}
                      className={cn(
                        "relative flex items-center justify-center rounded-[12px] transition-all duration-200 active:translate-y-px",
                        isActive
                          ? "text-foreground"
                          : "text-muted-foreground hover:bg-white/[0.06] hover:text-foreground"
                      )}
                      style={{ width: BTN_SIZE, height: BTN_SIZE }}
                    >
                      <span className="text-sm font-semibold">{server.name.charAt(0).toUpperCase()}</span>
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

      {/* Bottom spacer */}
      <div className="h-3 shrink-0" />
    </div>
  );
}
