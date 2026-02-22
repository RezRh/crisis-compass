import { useServerStore } from "@/stores/server-store";
import { cn } from "@/lib/utils";
import type { UserStatus } from "@/types/domain";

const statusColors: Record<UserStatus, string> = {
  online: "bg-discord-green",
  idle: "bg-discord-yellow",
  dnd: "bg-discord-red",
  offline: "bg-discord-grey",
};

const DISCORD_COLORS = [
  "hsl(235 86% 65%)",
  "hsl(139 47% 44%)",
  "hsl(38 96% 54%)",
  "hsl(0 84% 60%)",
  "hsl(197 100% 48%)",
  "hsl(326 78% 60%)",
];

function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return DISCORD_COLORS[Math.abs(hash) % DISCORD_COLORS.length];
}

export function MemberList() {
  const { members, activeServerId } = useServerStore();
  const serverMembers = activeServerId ? members[activeServerId] || [] : [];

  const online = serverMembers.filter((m) => m.user.status !== "offline");
  const offline = serverMembers.filter((m) => m.user.status === "offline");

  return (
    <div className="flex h-full w-60 flex-col bg-member-bar">
      <div className="flex-1 overflow-y-auto px-2 py-6 space-y-6">
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
      <p className="px-2 pb-[6px] text-[11px] font-semibold uppercase tracking-[0.02em] text-muted-foreground">{label}</p>
      <div className="space-y-[1px]">
        {members.map((m) => (
          <button
            key={m.user.id}
            className="flex w-full items-center gap-3 rounded px-2 py-[6px] transition-colors hover:bg-accent/40"
          >
            <div className="relative shrink-0">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full"
                style={{ backgroundColor: getAvatarColor(m.user.username) }}
              >
                <span className="text-white text-xs font-semibold">{m.user.username.charAt(0).toUpperCase()}</span>
              </div>
              <span
                className={cn(
                  "absolute -bottom-[1px] -right-[1px] h-[14px] w-[14px] rounded-full border-[3px] border-member-bar",
                  statusColors[m.user.status]
                )}
              />
            </div>
            <span className="truncate text-[15px] font-medium text-muted-foreground">{m.user.username}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
