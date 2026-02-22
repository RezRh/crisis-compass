import { useState } from "react";
import { useServerStore } from "@/stores/server-store";
import { useAuthStore } from "@/stores/auth-store";
import { useUIStore } from "@/stores/ui-store";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export function CreateServerDialog() {
  const { createServerOpen, setCreateServerOpen } = useUIStore();
  const { addServer } = useServerStore();
  const { user } = useAuthStore();
  const [name, setName] = useState("");

  const handleCreate = () => {
    if (!name.trim() || !user) return;
    addServer({
      id: `s-${Date.now()}`,
      name: name.trim(),
      icon_url: null,
      owner_id: user.id,
      created_at: new Date().toISOString(),
    });
    setName("");
    setCreateServerOpen(false);
  };

  return (
    <Dialog open={createServerOpen} onOpenChange={setCreateServerOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create a Server</DialogTitle>
          <DialogDescription>Give your new server a name. You can always change it later.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="server-name">Server Name</Label>
            <Input
              id="server-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Awesome Server"
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setCreateServerOpen(false)}>Cancel</Button>
          <Button onClick={handleCreate} disabled={!name.trim()}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function CreateChannelDialog() {
  const { createChannelOpen, setCreateChannelOpen } = useUIStore();
  const { addChannel, activeServerId } = useServerStore();
  const [name, setName] = useState("");

  const handleCreate = () => {
    if (!name.trim() || !activeServerId) return;
    addChannel({
      id: `c-${Date.now()}`,
      server_id: activeServerId,
      name: name.trim().toLowerCase().replace(/\s+/g, "-"),
      category: "Text Channels",
      position: 99,
      created_at: new Date().toISOString(),
    });
    setName("");
    setCreateChannelOpen(false);
  };

  return (
    <Dialog open={createChannelOpen} onOpenChange={setCreateChannelOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Channel</DialogTitle>
          <DialogDescription>Create a new text channel in this server.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="channel-name">Channel Name</Label>
            <Input
              id="channel-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="new-channel"
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setCreateChannelOpen(false)}>Cancel</Button>
          <Button onClick={handleCreate} disabled={!name.trim()}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
