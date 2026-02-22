import { useAuthStore } from "@/stores/auth-store";
import { useUIStore } from "@/stores/ui-store";
import { useServerStore } from "@/stores/server-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { X, Trash2 } from "lucide-react";
import { useState } from "react";

export function SettingsOverlay() {
  const { settingsView, closeSettings } = useUIStore();

  if (!settingsView) return null;

  return (
    <div className="fixed inset-0 z-50 flex bg-background/95 backdrop-blur-sm">
      {/* Nav sidebar */}
      <div className="flex w-56 flex-shrink-0 flex-col items-end bg-channel-bar pr-2 pt-16">
        <div className="space-y-0.5">
          <p className="mb-1 px-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            {settingsView === "user" ? "User Settings" : "Server Settings"}
          </p>
          <button className="w-full rounded-md bg-accent px-3 py-1.5 text-left text-sm font-medium text-foreground">
            {settingsView === "user" ? "My Account" : "Overview"}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-10 py-16">
        <div className="mx-auto max-w-xl">
          {settingsView === "user" ? <UserSettings /> : <ServerSettings />}
        </div>
      </div>

      {/* Close button */}
      <div className="fixed right-6 top-6 flex flex-col items-center gap-1">
        <button
          onClick={closeSettings}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>
        <span className="text-[11px] font-medium text-muted-foreground">ESC</span>
      </div>
    </div>
  );
}

function UserSettings() {
  const { user, updateProfile, logout } = useAuthStore();
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");

  const handleSave = () => {
    updateProfile({ username, email });
  };

  return (
    <div className="space-y-8">
      <h1 className="text-xl font-bold text-foreground">My Account</h1>

      <div className="overflow-hidden rounded-lg border border-border">
        <div className="h-24 bg-primary" />
        <div className="bg-card p-4">
          <div className="-mt-14 flex items-end gap-4">
            <Avatar className="h-20 w-20 border-[6px] border-card">
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                {user?.username?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <p className="pb-1 text-xl font-bold text-foreground">{user?.username}</p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-6 space-y-4">
        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Username</Label>
          <Input value={username} onChange={(e) => setUsername(e.target.value)} className="bg-input" />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email</Label>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} className="bg-input" />
        </div>
        <Button onClick={handleSave} className="font-semibold">Save Changes</Button>
      </div>

      <div className="rounded-lg border border-destructive/30 bg-card p-6">
        <h3 className="mb-2 font-semibold text-destructive">Danger Zone</h3>
        <p className="mb-4 text-sm text-muted-foreground">Logging out will end your current session.</p>
        <Button variant="destructive" onClick={logout}>Log Out</Button>
      </div>
    </div>
  );
}

function ServerSettings() {
  const { servers, activeServerId, deleteServer } = useServerStore();
  const { closeSettings } = useUIStore();
  const server = servers.find((s) => s.id === activeServerId);
  const [name, setName] = useState(server?.name || "");

  if (!server) return null;

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this server?")) {
      deleteServer(server.id);
      closeSettings();
    }
  };

  return (
    <div className="space-y-8">
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
  );
}
