import { useServerStore } from "@/stores/server-store";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { UserStatus } from "@/types/domain";

const statusColors: Record<UserStatus, string> = {
  online: "bg-discord-green",
  idle: "bg-discord-yellow",
  dnd: "bg-discord-red",
  offline: "bg-discord-grey",
};

function avatarColor(name: string) {
  const colors = [
    "bg-red-500", "bg-orange-500", "bg-amber-500", "bg-emerald-500",
    "bg-cyan-500", "bg-blue-500", "bg-violet-500", "bg-pink-500",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

export function MemberList() {
  const { members, activeServerId } = useServerStore();
  const serverMembers = activeServerId ? members[activeServerId] || [] : [];

  const online = serverMembers.filter((m) => m.user.status !== "offline");
  const offline = serverMembers.filter((m) => m.user.status === "offline");

  return (
    <div className="flex h-full w-60 flex-col bg-member-bar border-l border-border">
      <div className="flex-1 overflow-y-auto px-2 py-4 space-y-4">
        {online.length > 0 && <MemberGroup label={`Online — ${online.length}`} members={online} />}
        {offline.length > 0 && <MemberGroup label={`Offline — ${offline.length}`} members={offline} />}
      </div>
    </div>
  );
}

function MemberGroup({
  label,
  members,
}: {
  label: string;
  members: { user: { id: string; username: string; status: UserStatus } }[];
}) {
  return (
    <div>
      <p className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <div className="space-y-[1px]">
        {members.map((m) => (
          <button
            key={m.user.id}
            className="flex w-full items-center gap-3 rounded-md px-2 py-1.5 transition-colors hover:bg-accent"
          >
            <div className="relative">
              <Avatar className="h-8 w-8">
                <AvatarFallback className={`${avatarColor(m.user.username)} text-white text-xs font-bold`}>
                  {m.user.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span
                className={cn(
                  "absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-[2.5px] border-member-bar",
                  statusColors[m.user.status]
                )}
              />
            </div>
            <span className="truncate text-sm text-muted-foreground">{m.user.username}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
