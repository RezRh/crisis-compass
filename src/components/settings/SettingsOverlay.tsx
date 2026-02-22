import { useAuthStore } from "@/stores/auth-store";
import { useUIStore } from "@/stores/ui-store";
import { useServerStore } from "@/stores/server-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings, X, Trash2, Pencil, ChevronDown, ChevronRight, ExternalLink, BadgeCheck, MessageSquare, Zap, ShoppingCart, Star, Plus, Trophy, Smile, Gem, Gamepad2, Target, Github, Dice5 } from "lucide-react";
import { useState } from "react";
import serverIcon1 from "@/assets/server-icon-1.jpg";
import serverIcon2 from "@/assets/server-icon-2.jpg";
import serverIcon3 from "@/assets/server-icon-3.jpg";
import serverIcon4 from "@/assets/server-icon-4.jpg";

export function SettingsOverlay() {
  const { settingsView, closeSettings } = useUIStore();

  if (!settingsView) return null;

  return (
    <div className="fixed inset-0 z-50 flex bg-background">
      {settingsView === "user" ? (
        <UserProfileView onClose={closeSettings} />
      ) : (
        <ServerSettingsView onClose={closeSettings} />
      )}
    </div>
  );
}

/* ─── Discord-style User Profile Page ─── */
function UserProfileView({ onClose }: { onClose: () => void }) {
  const { user } = useAuthStore();

  const connections = [
    { icon: Gamepad2, name: "UdiishasDog#3617", verified: true, platform: "Battle.net" },
    { icon: Target, name: "RezinatorOp", verified: true, platform: "Epic Games" },
    { icon: Github, name: user?.username || "User", verified: true, platform: "GitHub", link: true },
    { icon: Dice5, name: "MarxistOP", verified: true, platform: "Steam", link: true },
  ];

  const friendAvatars = [serverIcon1, serverIcon2, serverIcon3, serverIcon4, serverIcon1];

  return (
    <div className="flex-1 overflow-y-auto bg-background">
      {/* Top bar icons */}
      <div className="sticky top-0 z-10 flex items-center justify-end gap-2 px-4 py-3">
        <button className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:text-foreground transition-colors">
          <Zap className="h-5 w-5" />
        </button>
        <button className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:text-foreground transition-colors">
          <ShoppingCart className="h-5 w-5 animate-bounce" />
        </button>
        <button className="flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-sm font-medium text-foreground hover:bg-accent/80 transition-colors">
          <Star className="h-4 w-4" />
          Prism
        </button>
        <button
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:text-foreground transition-colors"
        >
          <Settings className="h-5 w-5 animate-[spin_3s_linear_infinite]" />
        </button>
      </div>

      <div className="mx-auto max-w-md px-4 pb-8">
        {/* Avatar section */}
        <div className="relative mb-3">
          <Avatar className="h-24 w-24 ring-[3px] ring-discord-green ring-offset-[3px] ring-offset-background">
            <AvatarImage src={serverIcon1} alt={user?.username} className="object-cover" />
            <AvatarFallback className="bg-primary text-primary-foreground text-3xl font-bold">
              {user?.username?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {/* Status bubble */}
          <div className="absolute left-28 top-4 flex items-center gap-1.5 rounded-full bg-accent/80 px-3 py-1.5 text-xs text-muted-foreground">
            <Plus className="h-3.5 w-3.5" />
            Most satisfying game mechanic?
          </div>
        </div>

        {/* Username */}
        <div className="mb-1 flex items-center gap-2">
          <h1 className="text-2xl font-bold text-foreground">{user?.username || "DemoUser"}</h1>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="mb-5 flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{user?.email?.split("@")[0] || "demouser001"}</span>
          <span className="flex items-center gap-1 rounded bg-accent px-2 py-0.5 text-xs font-medium text-foreground">
            <Trophy className="h-3 w-3" /> McL
          </span>
          <div className="flex items-center gap-1">
            <Smile className="h-4 w-4 text-muted-foreground" />
            <Gem className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        {/* Edit Profile button */}
        <Button className="mb-6 w-full rounded-full bg-primary py-5 text-sm font-semibold hover:bg-primary/90">
          <Pencil className="mr-2 h-4 w-4" />
          Edit Profile
        </Button>

        {/* Orbs Balance */}
        <div className="mb-3 flex items-center justify-between rounded-xl bg-accent/60 p-4">
          <span className="text-sm font-medium text-muted-foreground">Fluxs Balance</span>
          <span className="flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-sm font-semibold text-foreground">
            <Gem className="h-4 w-4" /> 2530
          </span>
        </div>

        {/* Member Since */}
        <div className="mb-3 rounded-xl bg-accent/60 p-4">
          <p className="mb-1 text-sm font-medium text-muted-foreground">Member Since</p>
          <div className="flex items-center gap-2 text-sm text-foreground">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            Nov 17, 2025
          </div>
        </div>

        {/* Connections */}
        <div className="mb-3 rounded-xl bg-accent/60 p-4">
          <p className="mb-3 text-sm font-medium text-muted-foreground">Connections</p>
          <div className="space-y-0">
            {connections.map((conn, i) => (
              <div key={i}>
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <conn.icon className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm font-semibold text-foreground">{conn.name}</span>
                    {conn.verified && <BadgeCheck className="h-4 w-4 text-muted-foreground" />}
                  </div>
                  {conn.link && <ExternalLink className="h-4 w-4 text-muted-foreground" />}
                </div>
                {i < connections.length - 1 && <div className="h-px bg-border" />}
              </div>
            ))}
          </div>
        </div>

        {/* Friends */}
        <div className="mb-3 flex items-center justify-between rounded-xl bg-accent/60 p-4">
          <span className="text-sm font-medium text-muted-foreground">Friends</span>
          <div className="flex items-center gap-1">
            <div className="flex -space-x-2">
              {friendAvatars.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt="friend"
                  className="h-7 w-7 rounded-full border-2 border-accent object-cover"
                />
              ))}
            </div>
            <ChevronRight className="ml-1 h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        {/* Note */}
        <div className="rounded-xl bg-accent/60 p-4">
          <span className="text-sm text-muted-foreground">Note (only visible to you)</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Server Settings (unchanged logic) ─── */
function ServerSettingsView({ onClose }: { onClose: () => void }) {
  const { servers, activeServerId, deleteServer } = useServerStore();
  const server = servers.find((s) => s.id === activeServerId);
  const [name, setName] = useState(server?.name || "");

  if (!server) return null;

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this server?")) {
      deleteServer(server.id);
      onClose();
    }
  };

  return (
    <>
      {/* Nav sidebar */}
      <div className="flex w-56 flex-shrink-0 flex-col items-end bg-channel-bar pr-2 pt-16">
        <div className="space-y-0.5">
          <p className="mb-1 px-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Server Settings
          </p>
          <button className="w-full rounded-md bg-accent px-3 py-1.5 text-left text-sm font-medium text-foreground">
            Overview
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-10 py-16">
        <div className="mx-auto max-w-xl space-y-8">
          <h1 className="text-xl font-bold text-foreground">Server Overview</h1>

          <div className="rounded-lg border border-border bg-card p-6 space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Server Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} className="bg-input" />
            </div>
            <Button className="font-semibold">Save Changes</Button>
          </div>

          <div className="rounded-lg border border-destructive/30 bg-card p-6">
            <h3 className="mb-2 font-semibold text-destructive">Danger Zone</h3>
            <p className="mb-4 text-sm text-muted-foreground">Deleting a server is permanent and cannot be undone.</p>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Server
            </Button>
          </div>
        </div>
      </div>

      {/* Close button */}
      <div className="fixed right-6 top-6 flex flex-col items-center gap-1">
        <button
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>
        <span className="text-[11px] font-medium text-muted-foreground">ESC</span>
      </div>
    </>
  );
}
