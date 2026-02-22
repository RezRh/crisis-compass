import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { useServerStore } from "@/stores/server-store";
import { useMessageStore } from "@/stores/message-store";
import { useUIStore } from "@/stores/ui-store";
import { ServerSidebar } from "@/components/chat/ServerSidebar";
import { ChannelSidebar } from "@/components/chat/ChannelSidebar";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { MessageList } from "@/components/chat/MessageList";
import { MessageInput } from "@/components/chat/MessageInput";
import { MemberList } from "@/components/chat/MemberList";
import { CreateServerDialog, CreateChannelDialog } from "@/components/chat/Dialogs";
import { SettingsOverlay } from "@/components/settings/SettingsOverlay";
import { LoginPage } from "@/pages/LoginPage";

const ChatApp = () => {
  const { isAuthenticated } = useAuthStore();
  const { loadMockData } = useServerStore();
  const { loadMockMessages } = useMessageStore();
  const { showMemberList } = useUIStore();

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
    <div className="dark flex h-screen w-full overflow-hidden bg-background text-foreground">
      <ServerSidebar />
      <ChannelSidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <ChatHeader />
        <MessageList />
        <MessageInput />
      </div>
      {showMemberList && <MemberList />}

      {/* Dialogs */}
      <CreateServerDialog />
      <CreateChannelDialog />
      <SettingsOverlay />
    </div>
  );
};

export default ChatApp;
