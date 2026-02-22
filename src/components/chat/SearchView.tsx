import { useState, useCallback } from "react";
import { ArrowLeft, Search, SlidersHorizontal, X, Image, Link2, Pin, FileText, Users } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useUIStore } from "@/stores/ui-store";
import serverIcon1 from "@/assets/server-icon-1.jpg";
import serverIcon2 from "@/assets/server-icon-2.jpg";
import serverIcon3 from "@/assets/server-icon-3.jpg";
import serverIcon4 from "@/assets/server-icon-4.jpg";

const DISCORD_COLORS = [
  "hsl(235 86% 65%)", "hsl(139 47% 44%)", "hsl(38 96% 54%)",
  "hsl(0 84% 60%)", "hsl(197 100% 48%)", "hsl(326 78% 60%)",
];

function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return DISCORD_COLORS[Math.abs(hash) % DISCORD_COLORS.length];
}

const statusRingColors: Record<string, string> = {
  online: "ring-discord-green",
  idle: "ring-discord-yellow",
  dnd: "ring-discord-red",
  offline: "ring-discord-grey",
};

const tabs = ["Recent", "People", "Media", "Pins", "Links", "Files"] as const;

const searchHistory = [
  { username: "PhC", handle: "ovyr1n_", status: "online" as const },
];

const suggested = [
  { username: "PhC", handle: "ovyr1n_", status: "online" as const },
  { username: "Acrypsa", handle: "alkachlorine", status: "offline" as const },
  { username: "Aya", handle: "onychinusfemboy33", status: "online" as const },
];

const mockMedia = [serverIcon1, serverIcon2, serverIcon3, serverIcon4, serverIcon1, serverIcon2];

export function SearchView({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<typeof tabs[number]>("Recent");
  const [query, setQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrolled(e.currentTarget.scrollTop > 10);
  }, []);

  return (
    <div className="relative flex h-full w-full flex-col bg-server-bar overflow-y-auto" onScroll={handleScroll}>
      {/* Sticky header */}
      <div className="sticky top-0 z-10 pt-2">
        {/* Blur overlay */}
        <div
          className={`pointer-events-none absolute inset-0 transition-all duration-75 backdrop-blur-sm ${scrolled ? "backdrop-blur-md" : ""}`}
          style={{
            maskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
          }}
        />

        {/* Search bar row */}
        <div className="relative flex items-center gap-2 px-4 py-3">
          <button
            onClick={onBack}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          {/* Liquid glass search input */}
          <div className="flex flex-1 items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.04] backdrop-blur-2xl px-3 py-2 shadow-[0_2px_10px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.04)]">
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
            <input
              type="text"
              placeholder="Search in DMs"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-[14px] text-foreground placeholder:text-muted-foreground/60 outline-none"
              autoFocus
            />
          </div>

          <button className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/[0.06] bg-white/[0.04] backdrop-blur-2xl text-muted-foreground shadow-[0_2px_10px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.04)] transition-colors hover:bg-white/[0.08] hover:text-foreground">
            <SlidersHorizontal className="h-4 w-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="relative flex gap-1 px-4 pb-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-3 py-1.5 text-[13px] font-semibold transition-colors rounded-full ${
                activeTab === tab
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-5 rounded-full bg-primary" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="pb-24">
        {activeTab === "Recent" && <RecentTab />}
        {activeTab === "People" && <PeopleTab />}
        {activeTab === "Media" && <MediaTab />}
        {activeTab === "Pins" && <EmptyTab icon="pin" label="No pinned messages" />}
        {activeTab === "Links" && <EmptyTab icon="link" label="No shared links" />}
        {activeTab === "Files" && <EmptyTab icon="file" label="No shared files" />}
      </div>
    </div>
  );
}

function PersonRow({ username, handle, status, onRemove }: {
  username: string;
  handle: string;
  status: string;
  onRemove?: () => void;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-2.5">
      <div className="shrink-0">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full ring-[1.5px] ring-offset-1 ring-offset-server-bar ${statusRingColors[status] || "ring-discord-grey"}`}
          style={{ backgroundColor: getAvatarColor(username) }}
        >
          <span className="text-white font-semibold text-sm">{username.charAt(0)}</span>
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-semibold text-foreground truncate">{username}</p>
        <p className="text-[12px] text-muted-foreground truncate">{handle}</p>
      </div>
      {onRemove && (
        <button onClick={onRemove} className="text-muted-foreground hover:text-foreground transition-colors">
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

function RecentTab() {
  return (
    <>
      {/* Search History */}
      <div className="flex items-center justify-between px-4 pt-3 pb-1">
        <p className="text-[13px] font-semibold text-muted-foreground">Search History</p>
        <button className="text-[13px] font-semibold text-primary hover:underline">Clear all</button>
      </div>
      <div className="mx-4 rounded-2xl border border-white/[0.06] bg-white/[0.03] overflow-hidden mb-4">
        {searchHistory.map((person, i) => (
          <PersonRow key={i} {...person} onRemove={() => {}} />
        ))}
      </div>

      {/* Suggested */}
      <p className="px-4 pb-1 text-[13px] font-semibold text-muted-foreground">Suggested</p>
      <div className="mx-4 rounded-2xl border border-white/[0.06] bg-white/[0.03] overflow-hidden mb-4">
        {suggested.map((person, i) => (
          <div key={i}>
            <PersonRow {...person} />
            {i < suggested.length - 1 && <div className="mx-4 border-b border-white/[0.06]" />}
          </div>
        ))}
      </div>

      {/* Photos & Media */}
      <div className="flex items-center justify-between px-4 pt-1 pb-2">
        <p className="text-[13px] font-semibold text-muted-foreground">Photos & Media</p>
        <button className="text-[13px] font-semibold text-primary hover:underline">View all</button>
      </div>
      <div className="grid grid-cols-3 gap-1 px-4">
        {mockMedia.map((src, i) => (
          <div key={i} className="aspect-square overflow-hidden rounded-lg">
            <img src={src} alt="" className="h-full w-full object-cover" />
          </div>
        ))}
      </div>
    </>
  );
}

function PeopleTab() {
  return (
    <>
      <p className="px-4 pt-3 pb-1 text-[13px] font-semibold text-muted-foreground">Suggested</p>
      <div className="mx-4 rounded-2xl border border-white/[0.06] bg-white/[0.03] overflow-hidden">
        {suggested.map((person, i) => (
          <div key={i}>
            <PersonRow {...person} />
            {i < suggested.length - 1 && <div className="mx-4 border-b border-white/[0.06]" />}
          </div>
        ))}
      </div>
    </>
  );
}

function MediaTab() {
  return (
    <div className="grid grid-cols-3 gap-1 px-4 pt-3">
      {[...mockMedia, ...mockMedia].map((src, i) => (
        <div key={i} className="aspect-square overflow-hidden rounded-lg">
          <img src={src} alt="" className="h-full w-full object-cover" />
        </div>
      ))}
    </div>
  );
}

function EmptyTab({ icon, label }: { icon: string; label: string }) {
  const IconMap: Record<string, React.ReactNode> = {
    pin: <Pin className="h-10 w-10" />,
    link: <Link2 className="h-10 w-10" />,
    file: <FileText className="h-10 w-10" />,
  };
  return (
    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground/40">
      {IconMap[icon]}
      <p className="mt-2 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
