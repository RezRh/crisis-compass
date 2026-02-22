import { useAuthStore } from "@/stores/auth-store";
import { useUIStore } from "@/stores/ui-store";
import { useServerStore } from "@/stores/server-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings, X, Trash2, Pencil, ChevronDown, ChevronRight, ExternalLink, BadgeCheck, MessageSquare, Zap, ShoppingCart, Star, Plus, Trophy, Smile, Gem, Gamepad2, Target, Github, Dice5, Camera, ImagePlus } from "lucide-react";
import { useState, useRef } from "react";
import Lottie from "lottie-react";
import shopIconData from "@/assets/shop-icon.json";
import prismIconData from "@/assets/prism-icon.json";
import opsIconData from "@/assets/ops-icon.json";
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

  const [bannerUrl, setBannerUrl] = useState<string | null>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const connections = [
    { icon: Gamepad2, name: "UdiishasDog#3617", verified: true, platform: "Battle.net" },
    { icon: Target, name: "RezinatorOp", verified: true, platform: "Epic Games" },
    { icon: Github, name: user?.username || "User", verified: true, platform: "GitHub", link: true },
    { icon: Dice5, name: "MarxistOP", verified: true, platform: "Steam", link: true },
  ];

  const friendAvatars = [serverIcon1, serverIcon2, serverIcon3, serverIcon4, serverIcon1];

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setBannerUrl(url);
    }
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row h-full bg-background overflow-hidden">
      {/* LEFT — Banner panel (40%) — uploadable */}
      <div className="relative md:w-[40%] w-full h-[280px] md:h-full shrink-0 flex items-end md:items-center justify-center overflow-hidden">
        {/* Full-bleed banner image */}
        <img
          src={bannerUrl || serverIcon1}
          alt="Profile banner"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Neon lime shadow overlay */}
        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 shadow-[inset_0_0_120px_rgba(173,255,47,0.15)]" />
        <div className="absolute bottom-0 left-0 right-0 md:bottom-auto md:left-auto md:right-0 md:top-0 md:w-32 h-32 md:h-full bg-gradient-to-t md:bg-gradient-to-r from-background to-transparent" />




        {/* Username overlay on mobile */}
        <div className="relative z-10 p-6 md:hidden w-full">
          <h1 className="text-3xl font-black text-foreground drop-shadow-lg">{user?.username || "DemoUser"}</h1>
          <span className="text-sm text-muted-foreground">{user?.email?.split("@")[0] || "demouser001"}</span>
        </div>
      </div>

      {/* RIGHT — Command center tiles (60%) */}
      <div className="flex-1 overflow-y-auto md:w-[60%]">
        {/* Top bar — pfp + action icons */}
        <div className="flex items-center justify-between px-5 py-4">
          {/* Circular PFP with Prism artifact halo */}
          <div className="relative">
            {/* Liquid glass halo */}
            <div className="absolute -inset-2 rounded-full bg-white/[0.06] backdrop-blur-xl border border-white/[0.15] shadow-[0_0_20px_rgba(255,255,255,0.05),inset_0_0_20px_rgba(255,255,255,0.05)]" />
            <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-white/[0.12] via-transparent to-white/[0.06]" />
            <Avatar className="relative h-14 w-14 ring-[1.5px] ring-white/[0.2] ring-offset-1 ring-offset-transparent">
              <AvatarImage src={serverIcon1} alt={user?.username} className="object-cover" />
              <AvatarFallback className="bg-muted text-foreground text-xl font-bold">
                {user?.username?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Action icons */}
          <div className="flex items-center gap-2">
          <button className="flex h-9 w-9 items-center justify-center rounded-full transition-colors">
            <Lottie animationData={opsIconData} loop className="h-6 w-6 invert" />
          </button>
          <button className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:text-foreground transition-colors">
            <Lottie animationData={shopIconData} loop className="h-6 w-6 invert" />
          </button>
          <button className="flex items-center gap-1.5 rounded-full bg-white/[0.05] border border-primary/20 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-white/[0.08] transition-colors">
            <Lottie animationData={prismIconData} loop className="h-5 w-5 invert" />
            Prism
          </button>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full transition-colors"
          >
            <Settings className="h-5 w-5 text-foreground animate-[spin_3s_linear_infinite]" />
          </button>
          </div>
        </div>

        <div className="px-5 pb-28 space-y-3">
          {/* Desktop username — hidden on mobile */}
          <div className="hidden md:block mb-4">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-black text-foreground">{user?.username || "DemoUser"}</h1>
              <span className="flex items-center gap-1 rounded bg-white/[0.05] border border-primary/20 px-2 py-0.5 text-xs font-medium text-foreground">
                <Trophy className="h-3 w-3" /> McL
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">{user?.email?.split("@")[0] || "demouser001"}</span>
              {/* Artifacts — hexagon & diamond shapes */}
              <div className="flex items-center gap-2">
                <Artifact shape="hexagon" color="primary" label="P" />
                <Artifact shape="diamond" color="lime" label="⚡" />
                <Artifact shape="hexagon" color="muted" label="★" />
              </div>
            </div>
          </div>

          {/* Edit Profile */}
          <Button className="w-full rounded-full bg-primary py-5 text-sm font-semibold hover:bg-primary/90">
            <Pencil className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>

          {/* Tiles grid — two columns on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {/* Fluxs — Shard Count with pulse */}
            <div className="rounded-xl bg-white/[0.05] border border-primary/20 backdrop-blur-sm p-4">
              <p className="mb-2 text-sm font-medium text-muted-foreground">Fluxs</p>
              <div className="flex items-center gap-3">
                <span className="text-4xl font-black text-foreground animate-pulse">2,530</span>
                <Gem className="h-6 w-6 text-primary" />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Next reward at 3,000</p>
              {/* Glowing progress bar */}
              <div className="mt-2 h-1.5 w-full rounded-full bg-white/[0.08] overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary shadow-[0_0_10px_rgba(255,0,60,0.5)]"
                  style={{ width: "84%" }}
                />
              </div>
            </div>

            {/* Ops — Trial Progress */}
            <div className="rounded-xl bg-white/[0.05] border border-primary/20 backdrop-blur-sm p-4">
              <p className="mb-2 text-sm font-medium text-muted-foreground">Ops Level</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-foreground animate-pulse">Lv.12</span>
                <span className="text-sm text-muted-foreground">/ 20</span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">7 / 10 missions complete</p>
              {/* Glowing progress bar */}
              <div className="mt-2 h-1.5 w-full rounded-full bg-white/[0.08] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#ADFF2F] shadow-[0_0_10px_rgba(173,255,47,0.5)]"
                  style={{ width: "70%" }}
                />
              </div>
            </div>

            {/* Member Since — compact */}
            <div className="rounded-xl bg-white/[0.05] border border-primary/20 backdrop-blur-sm p-4">
              <p className="mb-1 text-sm font-medium text-muted-foreground">Member Since</p>
              <div className="flex items-center gap-2 text-sm text-foreground">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                Nov 17, 2025
              </div>
            </div>

            {/* Friends */}
            <div className="flex items-center justify-between rounded-xl bg-white/[0.05] border border-primary/20 backdrop-blur-sm p-4">
              <span className="text-sm font-medium text-muted-foreground">Friends</span>
              <div className="flex items-center gap-1">
                <div className="flex -space-x-2">
                  {friendAvatars.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt="friend"
                      className="h-7 w-7 rounded-full border-2 border-white/[0.1] object-cover"
                    />
                  ))}
                </div>
                <ChevronRight className="ml-1 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            {/* Artifacts */}
            <div className="rounded-xl bg-white/[0.05] border border-primary/20 backdrop-blur-sm p-4">
              <p className="mb-3 text-sm font-medium text-muted-foreground">Artifacts</p>
              <div className="flex items-center gap-3">
                <Artifact shape="hexagon" color="primary" label="P" size="lg" />
                <Artifact shape="diamond" color="lime" label="⚡" size="lg" />
                <Artifact shape="hexagon" color="muted" label="★" size="lg" />
                <Artifact shape="diamond" color="primary" label="♦" size="lg" />
              </div>
            </div>

            {/* Note */}
            <div className="rounded-xl bg-white/[0.05] border border-primary/20 backdrop-blur-sm p-4">
              <span className="text-sm text-muted-foreground">Note (only visible to you)</span>
            </div>
          </div>

          {/* Connections — full width */}
          <div className="rounded-xl bg-white/[0.05] border border-primary/20 backdrop-blur-sm p-4">
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
                  {i < connections.length - 1 && <div className="h-px bg-primary/10" />}
                </div>
              ))}
            </div>
          </div>
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

/* ─── Artifact Badge (Hexagon / Diamond) ─── */
function Artifact({
  shape,
  color,
  label,
  size = "sm",
}: {
  shape: "hexagon" | "diamond";
  color: "primary" | "lime" | "muted";
  label: string;
  size?: "sm" | "lg";
}) {
  const dim = size === "lg" ? "h-10 w-10" : "h-6 w-6";
  const textSize = size === "lg" ? "text-sm" : "text-[9px]";

  const colorMap = {
    primary: "bg-primary/20 border-primary/50 text-primary shadow-[0_0_8px_rgba(255,0,60,0.3)]",
    lime: "bg-[#ADFF2F]/15 border-[#ADFF2F]/40 text-[#ADFF2F] shadow-[0_0_8px_rgba(173,255,47,0.3)]",
    muted: "bg-white/[0.08] border-white/20 text-muted-foreground",
  };

  const clipPath =
    shape === "hexagon"
      ? "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)"
      : "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)";

  return (
    <div
      className={`${dim} flex items-center justify-center border ${colorMap[color]} ${textSize} font-bold`}
      style={{ clipPath }}
    >
      {label}
    </div>
  );
}
