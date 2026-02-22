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
import { Users, UserPlus, Search } from "lucide-react";

const ChatApp = () => {
  const { isAuthenticated } = useAuthStore();
  const { loadMockData } = useServerStore();
  const { loadMockMessages } = useMessageStore();
  const { showMemberList, mainView } = useUIStore();

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
    <div className="dark flex h-screen w-full overflow-hidden bg-chat-bg text-foreground">
      <ServerSidebar />
      {isDMs ? <DMSidebar /> : <ChannelSidebar />}
      <div className="flex flex-1 flex-col min-w-0 bg-chat-bg">
        {isDMs ? <DMHeader /> : <ChatHeader />}
        <div className="flex-1 overflow-hidden">
          {isDMs ? <DMContent /> : <MessageList />}
        </div>
        {!isDMs && <MessageInput />}
      </div>
      {!isDMs && showMemberList && <MemberList />}

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
