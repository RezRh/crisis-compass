import { useState, useCallback } from "react";
import { ArrowLeft, ChevronRight, UserPlus, Users, Search } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useUIStore } from "@/stores/ui-store";

const DISCORD_COLORS = [
  "hsl(235 86% 65%)", "hsl(139 47% 44%)", "hsl(38 96% 54%)",
  "hsl(0 84% 60%)", "hsl(197 100% 48%)", "hsl(326 78% 60%)",
];

function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return DISCORD_COLORS[Math.abs(hash) % DISCORD_COLORS.length];
}

const statusColors: Record<string, string> = {
  online: "ring-discord-green",
  idle: "ring-discord-yellow",
  dnd: "ring-discord-red",
  offline: "ring-discord-grey",
};

const mockFriends = [
  { id: "f1", username: "Acrypsa", handle: "alkachlorine", status: "offline" as const, badge: null },
  { id: "f2", username: "Alice", handle: "alice_dev", status: "online" as const, badge: null },
  { id: "f3", username: "Aya", handle: "onychinusfemboy33", status: "online" as const, badge: "PS" },
  { id: "f4", username: "Batwoman", handle: "ilovechipshehe", status: "offline" as const, badge: null },
  { id: "f5", username: "Bob", handle: "bob_builder", status: "idle" as const, badge: null },
  { id: "f6", username: "Charlie", handle: "charlie_x", status: "dnd" as const, badge: null },
  { id: "f7", username: "CHRONOS", handle: "chronoshow", status: "online" as const, badge: "BROS" },
  { id: "f8", username: "Dante", handle: "dante_fire", status: "offline" as const, badge: null },
  { id: "f9", username: "Diana", handle: "diana_moon", status: "offline" as const, badge: null },
  { id: "f10", username: "Freya", handle: "freya_nord", status: "idle" as const, badge: null },
  { id: "f11", username: "JohnnyTheRock", handle: "johnny_rocks", status: "offline" as const, badge: null },
  { id: "f12", username: "Kai", handle: "kai_zen", status: "online" as const, badge: null },
  { id: "f13", username: "Lena", handle: "lena_code", status: "online" as const, badge: null },
  { id: "f14", username: "Marcus", handle: "marcus_ship", status: "online" as const, badge: null },
  { id: "f15", username: "Mira", handle: "mira_api", status: "online" as const, badge: null },
  { id: "f16", username: "Nova", handle: "nova_star", status: "offline" as const, badge: null },
  { id: "f17", username: "Oscar", handle: "oscar_wild", status: "offline" as const, badge: null },
  { id: "f18", username: "PhC", handle: "ovyr1n_", status: "online" as const, badge: "PhC" },
  { id: "f19", username: "Priya", handle: "priya_dev", status: "dnd" as const, badge: null },
  { id: "f20", username: "Zane", handle: "zane_gg", status: "offline" as const, badge: null },
];

export function NewMessageView({ onBack }: { onBack: () => void }) {
  const { setActiveDM, setShowAddFriends, setShowNewMessage } = useUIStore();
  const [search, setSearch] = useState("");
  const [scrolled, setScrolled] = useState(false);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrolled(e.currentTarget.scrollTop > 10);
  }, []);

  const filtered = mockFriends.filter(
    (f) =>
      f.username.toLowerCase().includes(search.toLowerCase()) ||
      f.handle.toLowerCase().includes(search.toLowerCase())
  );

  // Group by first letter
  const suggested = filtered.slice(0, 3);
  const grouped: Record<string, typeof filtered> = {};
  filtered.forEach((f) => {
    const letter = f.username[0].toUpperCase();
    if (!grouped[letter]) grouped[letter] = [];
    grouped[letter].push(f);
  });
  const sortedLetters = Object.keys(grouped).sort();

  const handleSelectFriend = useCallback((username: string) => {
    setActiveDM(username);
    onBack();
  }, [setActiveDM, onBack]);

  return (
    <div className="relative flex h-full w-full flex-col bg-server-bar overflow-y-auto" onScroll={handleScroll}>
      {/* Header */}
      <div className="sticky top-0 z-10 pt-2">
        {/* Blur overlay — refractive glass that intensifies on scroll */}
        <div
          className={`pointer-events-none absolute inset-0 transition-all duration-75 backdrop-blur-sm ${scrolled ? "backdrop-blur-md" : ""}`}
          style={{
            maskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
          }}
        />
        <div className="relative flex items-center justify-between px-4 py-3">
          <button
            onClick={onBack}
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="text-[17px] font-bold text-foreground">New Message</h2>
          <div className="w-8" />
        </div>

        {/* Search bar — liquid glass */}
        <div className="relative px-4 pb-3">
          <div className="flex items-center gap-2 rounded-full border border-primary/30 bg-white/[0.04] backdrop-blur-2xl px-4 py-2.5 shadow-[0_2px_10px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.04),0_0_12px_rgba(255,0,60,0.1)]">
            <span className="text-[14px] text-muted-foreground shrink-0">To:</span>
            <input
              type="text"
              placeholder="Search your friends"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-[14px] text-foreground placeholder:text-muted-foreground/60 outline-none"
              autoFocus
            />
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="pb-24">
        {/* New Group & Add a Friend */}
        <div className="mx-4 mb-4 rounded-2xl border border-primary/20 bg-white/[0.03] overflow-hidden">
          <button className="flex w-full items-center gap-3 px-4 py-3.5 transition-colors hover:bg-white/[0.04]">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
              <Users className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="flex-1 text-left text-[15px] font-semibold text-foreground">New Group</span>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>
          <div className="mx-4 border-b border-primary/20" />
          <button
            onClick={() => { setShowNewMessage(false); setShowAddFriends(true); }}
            className="flex w-full items-center gap-3 px-4 py-3.5 transition-colors hover:bg-white/[0.04]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-discord-green">
              <UserPlus className="h-5 w-5 text-white" />
            </div>
            <span className="flex-1 text-left text-[15px] font-semibold text-foreground">Add a Friend</span>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Suggested */}
        {!search && (
          <>
            <p className="px-4 pb-2 text-[13px] font-semibold text-muted-foreground uppercase tracking-wide">Suggested</p>
            <div className="mx-4 mb-4 rounded-2xl border border-primary/20 bg-white/[0.03] overflow-hidden">
              {suggested.map((friend, i) => (
                <div key={friend.id}>
                  <FriendRow friend={friend} onSelect={handleSelectFriend} />
                  {i < suggested.length - 1 && <div className="mx-4 border-b border-primary/20" />}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Alphabetical groups */}
        {sortedLetters.map((letter) => (
          <div key={letter}>
            <p className="px-4 pb-2 pt-1 text-[13px] font-semibold text-muted-foreground uppercase tracking-wide">{letter}</p>
            <div className="mx-4 mb-4 rounded-2xl border border-primary/20 bg-white/[0.03] overflow-hidden">
              {grouped[letter].map((friend, i) => (
                <div key={friend.id}>
                  <FriendRow friend={friend} onSelect={handleSelectFriend} />
                  {i < grouped[letter].length - 1 && <div className="mx-4 border-b border-primary/20" />}
                </div>
              ))}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <Search className="h-10 w-10 mb-2 opacity-30" />
            <p className="text-sm">No friends found</p>
          </div>
        )}
      </div>
    </div>
  );
}

function FriendRow({
  friend,
  onSelect,
}: {
  friend: { id: string; username: string; handle: string; status: string; badge: string | null };
  onSelect: (username: string) => void;
}) {
  return (
    <button
      onClick={() => onSelect(friend.username)}
      className="flex w-full items-center gap-3 px-4 py-3 transition-colors hover:bg-white/[0.04]"
    >
      <div className="shrink-0">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full ring-[1.5px] ring-offset-1 ring-offset-server-bar ${statusColors[friend.status] || "ring-discord-grey"}`}
          style={{ backgroundColor: getAvatarColor(friend.username) }}
        >
          <span className="text-white font-semibold text-sm">{friend.username.charAt(0)}</span>
        </div>
      </div>
      <div className="flex-1 min-w-0 text-left">
        <div className="flex items-center gap-1.5">
          <span className="text-[15px] font-semibold text-foreground truncate">{friend.username}</span>
          {friend.badge && (
            <span className="shrink-0 rounded bg-white/[0.08] px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground">
              {friend.badge}
            </span>
          )}
        </div>
        <p className="text-[13px] text-muted-foreground truncate">{friend.handle}</p>
      </div>
    </button>
  );
}
