import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MoreHorizontal, UserPlus, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useUIStore } from "@/stores/ui-store";

interface Notification {
  id: string;
  username: string;
  avatarInitial: string;
  avatarColor: string;
  serverName: string;
  channelName: string;
  message: string;
  timeAgo: string;
}

const mockNotifications: Notification[] = [
  { id: "n1", username: "Alice", avatarInitial: "A", avatarColor: "hsl(200 70% 50%)", serverName: "Rust Dev", channelName: "general", message: "Has anyone tried the new Rust async traits?", timeAgo: "2m" },
  { id: "n2", username: "Bob", avatarInitial: "B", avatarColor: "hsl(120 50% 40%)", serverName: "Rust Dev", channelName: "help", message: "I'm running into a borrow checker issue", timeAgo: "5m" },
  { id: "n3", username: "Charlie", avatarInitial: "C", avatarColor: "hsl(30 80% 50%)", serverName: "Gaming Hub", channelName: "general", message: "Anyone up for a code review session?", timeAgo: "12m" },
  { id: "n4", username: "Alice", avatarInitial: "A", avatarColor: "hsl(200 70% 50%)", serverName: "Design Studio", channelName: "feedback", message: "Great work on the release! 🚀", timeAgo: "18m" },
  { id: "n5", username: "Diana", avatarInitial: "D", avatarColor: "hsl(280 60% 50%)", serverName: "Rust Dev", channelName: "general", message: "I just deployed my latest project", timeAgo: "25m" },
  { id: "n6", username: "Bob", avatarInitial: "B", avatarColor: "hsl(120 50% 40%)", serverName: "Gaming Hub", channelName: "looking-for-group", message: "Let me check that real quick", timeAgo: "33m" },
  { id: "n7", username: "Charlie", avatarInitial: "C", avatarColor: "hsl(30 80% 50%)", serverName: "Rust Dev", channelName: "announcements", message: "The docs need some updating", timeAgo: "35m" },
  { id: "n8", username: "Alice", avatarInitial: "A", avatarColor: "hsl(200 70% 50%)", serverName: "Design Studio", channelName: "general", message: "That's a really interesting approach", timeAgo: "39m" },
  { id: "n9", username: "Diana", avatarInitial: "D", avatarColor: "hsl(280 60% 50%)", serverName: "Rust Dev", channelName: "help", message: "Can someone review my PR?", timeAgo: "41m" },
  { id: "n10", username: "Bob", avatarInitial: "B", avatarColor: "hsl(120 50% 40%)", serverName: "Gaming Hub", channelName: "general", message: "I think we should refactor that module", timeAgo: "45m" },
];

interface NotificationsViewProps {
  onBack: () => void;
}

export function NotificationsView({ onBack }: NotificationsViewProps) {
  const { sidebarCollapsed, toggleSidebar } = useUIStore();

  return (
    <div className="flex h-full w-full flex-col bg-server-bar text-foreground">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 pt-12">
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); toggleSidebar(); }}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.06] bg-white/[0.04] text-muted-foreground shadow-[0_2px_10px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.04)] transition-colors hover:bg-white/[0.08] hover:text-foreground"
          >
            {sidebarCollapsed ? <PanelLeftOpen className="h-[18px] w-[18px]" /> : <PanelLeftClose className="h-[18px] w-[18px]" />}
          </button>
          <h1 className="text-xl font-bold text-white">Notifications</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex h-9 items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.04] px-3 text-[13px] font-medium text-muted-foreground shadow-[0_2px_10px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.04)] transition-colors hover:bg-white/[0.08] hover:text-foreground">
            <UserPlus className="h-4 w-4 shrink-0" />
            <span>Add Friends</span>
          </button>
          <button className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.08] text-muted-foreground hover:text-foreground transition-colors">
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Section label */}
      <div className="px-4 pb-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Recent Activity</span>
      </div>

      {/* Notifications list */}
      <div className="flex-1 overflow-y-auto pb-20">
        {mockNotifications.map((n) => (
          <div key={n.id} className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-white/[0.04] active:bg-white/[0.06]">
            <Avatar className="h-10 w-10 shrink-0">
              <AvatarFallback style={{ backgroundColor: n.avatarColor }} className="text-white text-sm font-bold">
                {n.avatarInitial}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm text-white">
                  <span className="font-bold">{n.username}</span>
                  {" replied to you in "}
                  <span className="font-bold">{n.serverName} #{n.channelName}</span>:
                </p>
                <span className="shrink-0 text-xs text-muted-foreground mt-0.5">{n.timeAgo}</span>
              </div>
              <div className="mt-1 flex items-start gap-0">
                <div className="w-[3px] shrink-0 self-stretch rounded-full bg-white/20" />
                <p className="pl-2 text-sm text-muted-foreground leading-snug line-clamp-3">{n.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
