import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { useUIStore } from "@/stores/ui-store";
import { DMSidebar } from "@/components/chat/DMSidebar";
import { ServerSidebar } from "@/components/chat/ServerSidebar";
import { ChatView } from "@/components/chat/ChatView";
import { NotificationsView } from "@/components/chat/NotificationsView";
import { SettingsOverlay } from "@/components/settings/SettingsOverlay";
import { LoginPage } from "@/pages/LoginPage";
import { Home, Bell, UserRoundPlus, Search, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useServerStore } from "@/stores/server-store";

const ChatApp = () => {
  const { isAuthenticated, user } = useAuthStore();
  const { loadMockData } = useServerStore();
  const { openSettings, sidebarCollapsed, activeDM, showNotifications, setShowNotifications } = useUIStore();

  useEffect(() => {
    if (isAuthenticated) {
      loadMockData();
    }
  }, [isAuthenticated, loadMockData]);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="dark relative flex h-screen w-full flex-col overflow-hidden bg-server-bar text-foreground">
      <div className="flex flex-1 min-h-0 min-w-0 overflow-hidden">
        {/* Mobile: full-screen views */}
        {showNotifications ? (
          <div className="flex w-full md:hidden">
            <NotificationsView onBack={() => setShowNotifications(false)} />
          </div>
        ) : activeDM ? (
          <div className="flex w-full md:hidden">
            <ChatView />
          </div>
        ) : (
          <div className="flex w-full md:hidden">
            {!sidebarCollapsed && <ServerSidebar />}
            <DMSidebar />
          </div>
        )}

        {/* Desktop: split view — sidebar + chat side by side */}
        <div className="hidden md:flex md:flex-1 md:min-w-0">
          {!sidebarCollapsed && <ServerSidebar />}
          <div className="w-80 shrink-0 border-r border-white/[0.06]">
            <DMSidebar />
          </div>
          <div className="flex-1 min-w-0">
            {activeDM ? (
              <ChatView />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                <div className="text-center space-y-2">
                  <MessageSquare className="h-12 w-12 mx-auto opacity-30" />
                  <p className="text-lg font-medium">Select a conversation</p>
                  <p className="text-sm">Choose a DM from the sidebar to start chatting</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile bottom tab bar — Apple Dock magnification */}
      {!activeDM && (
        <DockBar
          sidebarCollapsed={sidebarCollapsed}
          showNotifications={showNotifications}
          setShowNotifications={setShowNotifications}
          openSettings={openSettings}
          user={user}
        />
      )}

      <SettingsOverlay />
    </div>
  );
};

/* ── Apple Dock-style bottom bar with magnification ── */
const DOCK_ITEMS = ["home", "bell", "add", "profile"] as const;
const BASE_SIZE = 40;
const MAX_SIZE = 56;
const INFLUENCE_RANGE = 80; // px distance that still causes scaling

function DockBar({
  sidebarCollapsed,
  showNotifications,
  setShowNotifications,
  openSettings,
  user,
}: {
  sidebarCollapsed: boolean;
  showNotifications: boolean;
  setShowNotifications: (v: boolean) => void;
  openSettings: (v: "user" | "server" | null) => void;
  user: any;
}) {
  const barRef = useRef<HTMLDivElement>(null);
  const [scales, setScales] = useState<number[]>(DOCK_ITEMS.map(() => 1));
  const animRef = useRef<number | null>(null);

  const updateScales = useCallback((clientX: number) => {
    if (!barRef.current) return;
    const buttons = barRef.current.querySelectorAll<HTMLElement>("[data-dock]");
    const newScales = Array.from(buttons).map((btn) => {
      const rect = btn.getBoundingClientRect();
      const center = rect.left + rect.width / 2;
      const dist = Math.abs(clientX - center);
      if (dist > INFLUENCE_RANGE) return 1;
      const ratio = 1 - dist / INFLUENCE_RANGE;
      return 1 + ratio * ((MAX_SIZE / BASE_SIZE) - 1);
    });
    setScales(newScales);
  }, []);

  const resetScales = useCallback(() => {
    setScales(DOCK_ITEMS.map(() => 1));
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    animRef.current = requestAnimationFrame(() => updateScales(e.clientX));
  }, [updateScales]);

  const activeIdx = !showNotifications ? 0 : 1;

  return (
    <div className={`absolute bottom-0 right-0 z-30 flex items-end justify-center gap-3 pb-3 pt-1 md:hidden px-4 ${!sidebarCollapsed ? "left-[72px]" : "left-0"}`}>
      <div
        ref={barRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={resetScales}
        className="relative flex items-end gap-1 rounded-full border border-white/[0.06] bg-white/[0.04] backdrop-blur-md px-2 py-1.5 shadow-[0_2px_16px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.04),inset_0_-1px_4px_rgba(0,0,0,0.3)]"
      >
        {DOCK_ITEMS.map((item, i) => {
          const scale = scales[i];
          const isActive = i === activeIdx;
          const size = BASE_SIZE * scale;

          return (
            <button
              key={item}
              data-dock
              onClick={() => {
                if (item === "home") setShowNotifications(false);
                else if (item === "bell") setShowNotifications(true);
                else if (item === "profile") openSettings("user");
              }}
              className="relative flex items-center justify-center rounded-full transition-[width,height] duration-150 ease-out origin-bottom"
              style={{ width: size, height: size }}
            >
              {/* Active bubble behind */}
              {isActive && (
                <div className="absolute inset-0 rounded-full bg-white/[0.10] shadow-[0_0_20px_rgba(255,255,255,0.06),inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(255,255,255,0.05)] border border-white/[0.12]" />
              )}
              <div className="relative z-10">
                {item === "home" && (
                  <>
                    <Home className={`h-5 w-5 transition-colors duration-300 ${!showNotifications ? "text-foreground" : "text-muted-foreground"}`} />
                    {!showNotifications && (
                      <span className="absolute -top-1 -right-2 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-discord-red px-1 text-[10px] font-bold text-white">223</span>
                    )}
                  </>
                )}
                {item === "bell" && (
                  <>
                    <Bell className={`h-5 w-5 transition-colors duration-300 ${showNotifications ? "text-foreground" : "text-muted-foreground"}`} />
                    {showNotifications && (
                      <span className="absolute -top-1 -right-2 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-discord-red px-1 text-[10px] font-bold text-white">10</span>
                    )}
                  </>
                )}
                {item === "add" && <UserRoundPlus className="h-5 w-5 text-muted-foreground" />}
                {item === "profile" && (
                  <>
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="bg-primary text-primary-foreground text-[10px] font-bold">
                        {user?.username?.charAt(0).toUpperCase() || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="absolute bottom-0 right-0 h-[9px] w-[9px] rounded-full border-[1.5px] border-white/10 bg-discord-green" />
                  </>
                )}
              </div>
            </button>
          );
        })}
      </div>
      <button className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/[0.06] bg-white/[0.04] text-muted-foreground shadow-[0_2px_16px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-md transition-colors hover:bg-white/[0.08] hover:text-foreground mb-0.5">
        <Search className="h-5 w-5" />
      </button>
    </div>
  );
}

export default ChatApp;
