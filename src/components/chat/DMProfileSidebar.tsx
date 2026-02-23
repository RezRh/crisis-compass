import { User } from "lucide-react";

const DISCORD_COLORS = [
  "hsl(235 86% 65%)", "hsl(139 47% 44%)", "hsl(38 96% 54%)",
  "hsl(0 84% 60%)", "hsl(197 100% 48%)", "hsl(326 78% 60%)",
];

function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return DISCORD_COLORS[Math.abs(hash) % DISCORD_COLORS.length];
}

const mockProfiles: Record<string, { bio: string; memberSince: string; mutualServers?: string[] }> = {
  Batwoman: { bio: "I'm just chilling", memberSince: "Mar 19, 2024", mutualServers: ["Gaming Hub", "Dev Squad"] },
  Alice: { bio: "Building cool things ✨", memberSince: "Jan 5, 2025", mutualServers: ["React Devs"] },
  Bob: { bio: "Link collector 🔗", memberSince: "Jun 12, 2024" },
  Charlie: { bio: "AI enthusiast & coffee addict", memberSince: "Sep 1, 2023", mutualServers: ["AI Lab"] },
  Diana: { bio: "Helping where I can 💪", memberSince: "Nov 20, 2024" },
};

const defaultProfile: { bio: string; memberSince: string; mutualServers?: string[] } = { bio: "No bio set", memberSince: "Unknown" };

interface DMProfileSidebarProps {
  username: string;
  visible: boolean;
}

export function DMProfileSidebar({ username, visible }: DMProfileSidebarProps) {
  const profile = mockProfiles[username] || defaultProfile;
  const avatarColor = getAvatarColor(username);

  return (
    <div
      className={`h-full border-l border-white/[0.06] bg-server-bar transition-all duration-300 overflow-hidden ${
        visible ? "w-[280px] min-w-[280px] opacity-100" : "w-0 min-w-0 opacity-0"
      }`}
    >
      <div className="w-[280px] h-full flex flex-col overflow-y-auto">
        {/* Banner */}
        <div className="relative h-[100px] shrink-0" style={{ backgroundColor: avatarColor }} />

        {/* Avatar overlapping banner */}
        <div className="relative px-4">
          <div
            className="-mt-10 flex h-[72px] w-[72px] items-center justify-center rounded-full border-[5px] border-server-bar"
            style={{ backgroundColor: avatarColor }}
          >
            <span className="text-white text-2xl font-bold">{username.charAt(0)}</span>
          </div>
        </div>

        {/* Name */}
        <div className="px-4 pt-2 pb-3">
          <h3 className="text-lg font-bold text-foreground">{username}</h3>
          <p className="text-[13px] text-muted-foreground">{username.toLowerCase().replace(/\s/g, "")} • Online</p>
        </div>

        {/* Info tiles */}
        <div className="mx-3 space-y-3">
          <div className="rounded-lg border border-white/[0.06] bg-white/[0.04] p-3">
            <h4 className="text-[12px] font-bold text-foreground uppercase tracking-wide mb-1">About Me</h4>
            <p className="text-[13px] text-foreground/80">{profile.bio}</p>
          </div>

          <div className="rounded-lg border border-white/[0.06] bg-white/[0.04] p-3">
            <h4 className="text-[12px] font-bold text-foreground uppercase tracking-wide mb-1">Member Since</h4>
            <p className="text-[13px] text-foreground/80">{profile.memberSince}</p>
          </div>

          {profile.mutualServers && profile.mutualServers.length > 0 && (
            <div className="rounded-lg border border-white/[0.06] bg-white/[0.04] p-3">
              <h4 className="text-[12px] font-bold text-foreground uppercase tracking-wide mb-2">Mutual Servers</h4>
              <div className="space-y-1.5">
                {profile.mutualServers.map((server) => (
                  <div key={server} className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-white/[0.1] flex items-center justify-center">
                      <span className="text-[10px] font-semibold text-foreground">{server.charAt(0)}</span>
                    </div>
                    <span className="text-[13px] text-foreground/80">{server}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
