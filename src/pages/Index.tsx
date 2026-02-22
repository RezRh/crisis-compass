import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { useUIStore } from "@/stores/ui-store";
import { DMSidebar } from "@/components/chat/DMSidebar";
import { NewMessageView } from "@/components/chat/NewMessageView";
import { ServerSidebar } from "@/components/chat/ServerSidebar";
import { ChatView } from "@/components/chat/ChatView";
import { NotificationsView } from "@/components/chat/NotificationsView";
import { SettingsOverlay } from "@/components/settings/SettingsOverlay";
import { LoginPage } from "@/pages/LoginPage";
import { Home, Bell, UserRoundPlus, Search, MessageSquare, MessageSquarePlus } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useServerStore } from "@/stores/server-store";

const ChatApp = () => {
  const { isAuthenticated, user } = useAuthStore();
  const { loadMockData } = useServerStore();
  const { openSettings, closeSettings, settingsView, sidebarCollapsed, activeDM, showNotifications, setShowNotifications, showNewMessage, setShowNewMessage } = useUIStore();

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
        {showNewMessage ? (
          <div className="flex w-full md:hidden">
            <NewMessageView onBack={() => setShowNewMessage(false)} />
          </div>
        ) : showNotifications ? (
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

      {/* Mobile bottom tab bar — always visible */}
      <DockBar
        sidebarCollapsed={sidebarCollapsed}
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
        showNewMessage={showNewMessage}
        setShowNewMessage={setShowNewMessage}
        openSettings={openSettings}
        closeSettings={closeSettings}
        settingsView={settingsView}
        user={user}
      />

      <SettingsOverlay />
    </div>
  );
};

/* ── Bottom bar with draggable glass bubble ── */
function DockBar({
  sidebarCollapsed,
  showNotifications,
  setShowNotifications,
  showNewMessage,
  setShowNewMessage,
  openSettings,
  closeSettings,
  settingsView,
  user,
}: {
  sidebarCollapsed: boolean;
  showNotifications: boolean;
  setShowNotifications: (v: boolean) => void;
  showNewMessage: boolean;
  setShowNewMessage: (v: boolean) => void;
  openSettings: (v: "user" | "server" | null) => void;
  closeSettings: () => void;
  settingsView: "user" | "server" | null;
  user: any;
}) {
  const barRef = useRef<HTMLDivElement>(null);
  const [bubbleX, setBubbleX] = useState<number | null>(null);
  const bubbleXRef = useRef<number | null>(null);
  const isDragging = useRef(false);
  const didDrag = useRef(false);

  // Determine which button is "active"
  const activeIdx = settingsView === "user" ? 3 : showNewMessage ? 2 : showNotifications ? 1 : 0;

  const getActiveLeft = useCallback(() => {
    if (!barRef.current) return 12;
    const buttons = barRef.current.querySelectorAll<HTMLElement>("[data-dock]");
    const btn = buttons[activeIdx];
    if (!btn) return 12;
    const barRect = barRef.current.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    return btnRect.left - barRect.left + (btnRect.width - 40) / 2;
  }, [activeIdx]);

  const startPos = useRef<{ x: number; y: number } | null>(null);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    startPos.current = { x: e.clientX, y: e.clientY };
    didDrag.current = false;
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!startPos.current || !barRef.current) return;
    // Only start dragging after 5px movement threshold
    if (!isDragging.current) {
      const dx = e.clientX - startPos.current.x;
      const dy = e.clientY - startPos.current.y;
      if (Math.abs(dx) < 5 && Math.abs(dy) < 5) return;
      isDragging.current = true;
      didDrag.current = true;
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    }
    const barRect = barRef.current.getBoundingClientRect();
    const x = e.clientX - barRect.left - 20;
    const clamped = Math.max(4, Math.min(x, barRect.width - 44));
    bubbleXRef.current = clamped;
    setBubbleX(clamped);
  }, []);

  const snapToClosest = useCallback(() => {
    if (!barRef.current || bubbleXRef.current === null) return;
    const buttons = barRef.current.querySelectorAll<HTMLElement>("[data-dock]");
    const barRect = barRef.current.getBoundingClientRect();
    let closestIdx = 0;
    let closestDist = Infinity;
    buttons.forEach((btn, i) => {
      const btnRect = btn.getBoundingClientRect();
      const center = btnRect.left - barRect.left + btnRect.width / 2;
      const bubbleCenter = bubbleXRef.current! + 20;
      const dist = Math.abs(center - bubbleCenter);
      if (dist < closestDist) {
        closestDist = dist;
        closestIdx = i;
      }
    });

    if (closestIdx === 0) { closeSettings(); setShowNotifications(false); setShowNewMessage(false); }
    else if (closestIdx === 1) { closeSettings(); setShowNotifications(true); setShowNewMessage(false); }
    else if (closestIdx === 2) { closeSettings(); setShowNotifications(false); setShowNewMessage(true); }
    else if (closestIdx === 3) { openSettings("user"); setShowNewMessage(false); }

    bubbleXRef.current = null;
    setBubbleX(null);
  }, [setShowNotifications, setShowNewMessage, openSettings, closeSettings]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    startPos.current = null;
    if (!isDragging.current) return;
    isDragging.current = false;
    if (didDrag.current) {
      e.preventDefault();
      e.stopPropagation();
      snapToClosest();
    } else {
      bubbleXRef.current = null;
      setBubbleX(null);
    }
  }, [snapToClosest]);

  const displayLeft = bubbleX ?? getActiveLeft();

  // Sidebar is only visible on home view (no settings, no notifications, no activeDM on mobile)
  const sidebarVisible = !sidebarCollapsed && !settingsView && !showNotifications && !showNewMessage;

  return (
    <div className={`fixed bottom-0 right-0 z-[60] flex items-center justify-center gap-3 pb-3 pt-1 md:hidden px-4 transition-[left] duration-300 ${sidebarVisible ? "left-[72px]" : "left-0"}`}>
      <div
        ref={barRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={() => { isDragging.current = false; didDrag.current = false; startPos.current = null; bubbleXRef.current = null; setBubbleX(null); }}
        className="relative flex items-center gap-3 rounded-full border border-white/[0.06] bg-white/[0.04] backdrop-blur-md px-3 py-2 shadow-[0_2px_16px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.04),inset_0_-1px_4px_rgba(0,0,0,0.3)] touch-none"
      >
        {/* Glass bubble — follows finger, snaps on release */}
        <div
          className={`pointer-events-none absolute z-0 h-10 w-10 ${bubbleX === null ? "transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]" : "transition-none"}`}
          style={{ left: displayLeft }}
        >
          <div className="h-full w-full rounded-full bg-white/[0.10] shadow-[0_0_20px_rgba(255,255,255,0.06),inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(255,255,255,0.05)] backdrop-blur-xl border border-white/[0.12]" />
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/[0.08] via-transparent to-purple-500/[0.06]" />
        </div>

        <button
          data-dock
          onClick={() => { if (!didDrag.current) { closeSettings(); setShowNotifications(false); setShowNewMessage(false); } }}
          className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full transition-all"
        >
          <Home className={`h-5 w-5 transition-colors duration-300 ${activeIdx === 0 ? "text-foreground" : "text-muted-foreground"}`} />
          {!showNotifications && (
            <span className="absolute -top-1 -right-1 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-discord-red px-1 text-[10px] font-bold text-white">223</span>
          )}
        </button>
        <button
          data-dock
          onClick={() => { if (!didDrag.current) { closeSettings(); setShowNotifications(true); setShowNewMessage(false); } }}
          className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full transition-all"
        >
          <Bell className={`h-5 w-5 transition-colors duration-300 ${activeIdx === 1 ? "text-foreground" : "text-muted-foreground"}`} />
          {showNotifications && (
            <span className="absolute -top-1 -right-1 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-discord-red px-1 text-[10px] font-bold text-white">10</span>
          )}
        </button>
        <button
          data-dock
          onClick={() => { if (!didDrag.current) { closeSettings(); setShowNotifications(false); setShowNewMessage(true); } }}
          className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full transition-all hover:bg-white/[0.04]"
        >
          <MessageSquarePlus className={`h-5 w-5 transition-colors duration-300 ${activeIdx === 2 ? "text-foreground" : "text-muted-foreground"}`} />
        </button>
        <button
          data-dock
          onClick={() => { if (!didDrag.current) openSettings("user"); }}
          className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full transition-all hover:bg-white/[0.04]"
        >
          <Avatar className="h-6 w-6 ring-2 ring-discord-green ring-offset-1 ring-offset-server-bar">
            <AvatarFallback className="bg-primary text-primary-foreground text-[10px] font-bold">
              {user?.username?.charAt(0).toUpperCase() || "?"}
            </AvatarFallback>
          </Avatar>
        </button>
      </div>
      <button className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/[0.06] bg-white/[0.04] text-muted-foreground shadow-[0_2px_16px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-md transition-colors hover:bg-white/[0.08] hover:text-foreground">
        <Search className="h-5 w-5" />
      </button>
    </div>
  );
}

export default ChatApp;
