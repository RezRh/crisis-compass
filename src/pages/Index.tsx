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
          {/* Liquid Glass Tab Bar */}
          <div className="flex justify-center pb-2 pt-1 md:hidden">
            <div className="flex items-center gap-1 rounded-full border border-white/[0.08] bg-white/[0.06] px-2 py-1.5 backdrop-blur-2xl shadow-[0_4px_24px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.06),inset_0_-2px_8px_rgba(0,0,0,0.2)]">
              {/* Home - active */}
              <button className="relative flex items-center gap-2 rounded-full bg-white/[0.1] px-5 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_2px_8px_rgba(0,0,0,0.3)] transition-all">
                <div className="relative">
                  <Home className="h-5 w-5 text-foreground" />
                  <span className="absolute -top-2 -right-3 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-discord-red px-1 text-[10px] font-bold text-white">
                    223
                  </span>
                </div>
                <span className="text-[13px] font-semibold text-foreground">Home</span>
              </button>
              {/* Notifications */}
              <button className="flex flex-col items-center rounded-full px-5 py-2.5 transition-all hover:bg-white/[0.06]">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <span className="text-[10px] font-medium text-muted-foreground mt-0.5">Notifications</span>
              </button>
              {/* You */}
              <button
                onClick={() => openSettings("user")}
                className="flex flex-col items-center rounded-full px-5 py-2.5 transition-all hover:bg-white/[0.06]"
              >
                <div className="relative">
                  <Avatar className="h-5 w-5">
                    <AvatarFallback className="bg-primary text-primary-foreground text-[9px] font-bold">
                      {user?.username?.charAt(0).toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="absolute -bottom-[1px] -right-[1px] h-[9px] w-[9px] rounded-full border-[1.5px] border-white/10 bg-discord-green" />
                </div>
                <span className="text-[10px] font-medium text-muted-foreground mt-0.5">You</span>
              </button>
            </div>
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
