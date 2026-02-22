import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { useUIStore } from "@/stores/ui-store";
import { DMSidebar } from "@/components/chat/DMSidebar";
import { SettingsOverlay } from "@/components/settings/SettingsOverlay";
import { LoginPage } from "@/pages/LoginPage";
import { Home, Bell, UserRoundPlus, PanelLeftOpen, MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageList } from "@/components/chat/MessageList";
import { MessageInput } from "@/components/chat/MessageInput";
import { useMessageStore } from "@/stores/message-store";
import { useServerStore } from "@/stores/server-store";

const ChatApp = () => {
  const { isAuthenticated, user } = useAuthStore();
  const { loadMockData } = useServerStore();
  const { loadMockMessages } = useMessageStore();
  const { openSettings, sidebarCollapsed, toggleSidebar } = useUIStore();

  useEffect(() => {
    if (isAuthenticated) {
      loadMockData();
      loadMockMessages();
    }
  }, [isAuthenticated, loadMockData, loadMockMessages]);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="dark relative flex h-screen w-full flex-col overflow-hidden bg-server-bar text-foreground">
      {/* Main row */}
      <div className="flex flex-1 min-h-0 min-w-0 overflow-hidden">
        {/* DM Sidebar - hidden when collapsed */}
        {!sidebarCollapsed && (
          <div className="flex min-w-0 flex-1 md:flex-none">
            <DMSidebar />
          </div>
        )}

        {/* Chat panel - shows when sidebar is collapsed (mobile) or always on desktop */}
        <div className={`flex flex-1 flex-col min-w-0 bg-chat-bg ${!sidebarCollapsed ? "hidden md:flex" : "flex"}`}>
          {/* Chat header with reopen button */}
          <header className="flex h-12 items-center gap-3 bg-chat-bg px-4 shadow-[0_1px_0_rgba(0,0,0,0.2)]">
            <button onClick={toggleSidebar} className="p-[6px] text-muted-foreground transition-colors hover:text-foreground">
              <PanelLeftOpen className="h-5 w-5" />
            </button>
            <MessageCircle className="h-5 w-5 text-muted-foreground" />
            <h2 className="font-bold text-[15px] text-foreground">Batwoman</h2>
          </header>
          <div className="flex-1 overflow-hidden">
            <MessageList />
          </div>
          <MessageInput />
        </div>
      </div>

      {/* Mobile bottom tab bar */}
      {!sidebarCollapsed && (
        <div className="flex justify-center bg-server-bar pb-3 pt-1 md:hidden">
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
        </div>
      )}

      <SettingsOverlay />
    </div>
  );
};

export default ChatApp;
