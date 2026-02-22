import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { useUIStore } from "@/stores/ui-store";
import { DMSidebar } from "@/components/chat/DMSidebar";
import { ServerSidebar } from "@/components/chat/ServerSidebar";
import { ChatView } from "@/components/chat/ChatView";
import { SettingsOverlay } from "@/components/settings/SettingsOverlay";
import { LoginPage } from "@/pages/LoginPage";
import { Home, Bell, UserRoundPlus, Search, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useServerStore } from "@/stores/server-store";

const ChatApp = () => {
  const { isAuthenticated, user } = useAuthStore();
  const { loadMockData } = useServerStore();
  const { openSettings, sidebarCollapsed, activeDM } = useUIStore();

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
        {/* Mobile: full-screen chat when DM is active */}
        {activeDM ? (
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

      {/* Mobile bottom tab bar — hidden when in chat */}
      {!activeDM && (
        <div className="flex items-center justify-center gap-3 bg-server-bar pb-3 pt-1 md:hidden px-4">
          <div className="flex items-center gap-3 rounded-full border border-white/[0.06] bg-white/[0.04] px-3 py-2 shadow-[0_2px_16px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.04),inset_0_-1px_4px_rgba(0,0,0,0.3)]">
            <button className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-all">
              <Home className="h-5 w-5 text-foreground" />
              <span className="absolute -top-1 -right-1 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-discord-red px-1 text-[10px] font-bold text-white">223</span>
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-full transition-all hover:bg-white/[0.04]">
              <Bell className="h-5 w-5 text-muted-foreground" />
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-full transition-all hover:bg-white/[0.04]">
              <UserRoundPlus className="h-5 w-5 text-muted-foreground" />
            </button>
            <button
              onClick={() => openSettings("user")}
              className="relative flex h-10 w-10 items-center justify-center rounded-full transition-all hover:bg-white/[0.04]"
            >
              <Avatar className="h-6 w-6">
                <AvatarFallback className="bg-primary text-primary-foreground text-[10px] font-bold">
                  {user?.username?.charAt(0).toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
              <span className="absolute bottom-0.5 right-0.5 h-[9px] w-[9px] rounded-full border-[1.5px] border-white/10 bg-discord-green" />
            </button>
          </div>
          <button className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/[0.06] bg-white/[0.04] text-muted-foreground shadow-[0_2px_16px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-md transition-colors hover:bg-white/[0.08] hover:text-foreground">
            <Search className="h-5 w-5" />
          </button>
        </div>
      )}

      <SettingsOverlay />
    </div>
  );
};

export default ChatApp;
