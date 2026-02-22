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
    <div className="fixed inset-0 z-50 flex bg-background">
      <div className="w-56 flex-shrink-0 bg-channel-bar" />
      <div className="flex-1 overflow-y-auto px-10 py-16">
        <div className="mx-auto max-w-2xl">
          {settingsView === "user" ? <UserSettings /> : <ServerSettings />}
        </div>
      </div>
      <button
        onClick={closeSettings}
        className="fixed right-6 top-6 flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground"
      >
        <X className="h-5 w-5" />
      </button>
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
      <div className="flex items-center gap-4 rounded-lg bg-card p-4">
        <Avatar className="h-20 w-20">
          <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
            {user?.username?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-lg font-semibold text-foreground">{user?.username}</p>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Username</Label>
          <Input value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Email</Label>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </div>
      <div className="border-t border-border pt-6">
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
      <h1 className="text-xl font-bold text-foreground">Server Settings</h1>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Server Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <Button>Save Changes</Button>
      </div>
      <div className="border-t border-border pt-6">
        <Button variant="destructive" onClick={handleDelete}>
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Server
        </Button>
      </div>
    </div>
  );
}
