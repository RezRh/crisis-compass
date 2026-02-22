import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { useServerStore } from "@/stores/server-store";
import { useMessageStore } from "@/stores/message-store";
import { useUIStore } from "@/stores/ui-store";
import { ServerSidebar } from "@/components/chat/ServerSidebar";
import { ChannelSidebar } from "@/components/chat/ChannelSidebar";
import { DMSidebar } from "@/components/chat/DMSidebar";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { MessageList } from "@/components/chat/MessageList";
import { MessageInput } from "@/components/chat/MessageInput";
import { MemberList } from "@/components/chat/MemberList";
import { CreateServerDialog, CreateChannelDialog } from "@/components/chat/Dialogs";
import { SettingsOverlay } from "@/components/settings/SettingsOverlay";
import { LoginPage } from "@/pages/LoginPage";
import { Users, Home, Bell, UserRoundPlus } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const ChatApp = () => {
  const { isAuthenticated } = useAuthStore();
  const { user } = useAuthStore();
  const { loadMockData } = useServerStore();
  const { loadMockMessages } = useMessageStore();
  const { showMemberList, mainView, openSettings } = useUIStore();

  useEffect(() => {
    if (isAuthenticated) {
      loadMockData();
      loadMockMessages();
    }
  }, [isAuthenticated, loadMockData, loadMockMessages]);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const isDMs = mainView === "dms";

  return (
    <div className="dark relative flex h-screen w-full flex-col overflow-hidden bg-chat-bg text-foreground">
      {/* Main row */}
      <div className="flex flex-1 min-h-0">
        <ServerSidebar />
        {isDMs ? <DMSidebar /> : <ChannelSidebar />}
        <div className={`flex flex-1 flex-col min-w-0 bg-chat-bg ${isDMs ? "hidden md:flex" : ""}`}>
          {isDMs ? <DMHeader /> : <ChatHeader />}
          <div className="flex-1 overflow-hidden">
            {isDMs ? <DMContent /> : <MessageList />}
          </div>
          {!isDMs && <MessageInput />}
        </div>
        {!isDMs && showMemberList && <MemberList />}
      </div>

      {/* Mobile bottom tab bar - full width, outside the flex row */}
      {isDMs && (
        <>
          {/* FAB */}
          <div className="absolute bottom-20 right-4 z-10 md:hidden">
            <button className="flex h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/30 text-primary-foreground active:scale-95 transition-transform">
              <UserRoundPlus className="h-6 w-6" />
            </button>
          </div>
          {/* Tab bar */}
          <div className="flex items-center justify-around border-t border-border bg-server-bar py-2 md:hidden">
            <button className="flex flex-col items-center gap-0.5">
              <div className="relative">
                <Home className="h-6 w-6 text-foreground" />
                <span className="absolute -top-2 -right-3 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-discord-red px-1 text-[11px] font-bold text-white">
                  223
                </span>
              </div>
              <span className="text-[10px] font-medium text-foreground mt-1">Home</span>
            </button>
            <button className="flex flex-col items-center gap-0.5">
              <Bell className="h-6 w-6 text-muted-foreground" />
              <span className="text-[10px] font-medium text-muted-foreground">Notifications</span>
            </button>
            <button
              onClick={() => openSettings("user")}
              className="flex flex-col items-center gap-0.5"
            >
              <div className="relative">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="bg-primary text-primary-foreground text-[10px] font-bold">
                    {user?.username?.charAt(0).toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
                <span className="absolute -bottom-[1px] -right-[1px] h-[10px] w-[10px] rounded-full border-2 border-server-bar bg-discord-green" />
              </div>
              <span className="text-[10px] font-medium text-muted-foreground">You</span>
            </button>
          </div>
        </>
      )}

      <CreateServerDialog />
      <CreateChannelDialog />
      <SettingsOverlay />
    </div>
  );
};

function DMHeader() {
  return (
    <header className="flex h-12 items-center gap-4 bg-chat-bg px-4 shadow-[0_1px_0_rgba(0,0,0,0.2)]">
      <div className="flex items-center gap-2">
        <Users className="h-6 w-6 text-muted-foreground" />
        <h2 className="font-bold text-[15px] text-foreground">Friends</h2>
      </div>
      <div className="h-6 w-px bg-border/50" />
      <div className="flex items-center gap-2">
        {["Online", "All", "Pending", "Blocked"].map((tab) => (
          <button
            key={tab}
            className={`rounded px-2 py-[2px] text-[13px] font-medium transition-colors ${
              tab === "Online" ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent/30 hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
        <button className="rounded bg-discord-green px-2 py-[2px] text-[13px] font-medium text-white">
          Add Friend
        </button>
      </div>
    </header>
  );
}

function DMContent() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center space-y-3">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-accent">
          <Users className="h-10 w-10 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground">No one's around to play with Wumpus.</p>
      </div>
    </div>
  );
}

export default ChatApp;
