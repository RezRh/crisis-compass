import { create } from "zustand";
import type { Server, Channel, ServerMember } from "@/types/domain";
import { mockServers, mockChannels, mockMembers } from "@/services/mock-data";

interface ServerState {
  servers: Server[];
  channels: Record<string, Channel[]>;
  members: Record<string, ServerMember[]>;
  activeServerId: string | null;
  activeChannelId: string | null;

  setActiveServer: (id: string) => void;
  setActiveChannel: (id: string) => void;
  loadMockData: () => void;
  addServer: (server: Server) => void;
  addChannel: (channel: Channel) => void;
  deleteServer: (id: string) => void;
}

export const useServerStore = create<ServerState>((set, get) => ({
  servers: [],
  channels: {},
  members: {},
  activeServerId: null,
  activeChannelId: null,

  setActiveServer: (id) => {
    const channels = get().channels[id] || [];
    const firstChannel = channels[0]?.id || null;
    set({ activeServerId: id, activeChannelId: firstChannel });
  },

  setActiveChannel: (id) => {
    set({ activeChannelId: id });
  },

  loadMockData: () => {
    set({
      servers: mockServers,
      channels: mockChannels,
      members: mockMembers,
      activeServerId: mockServers[0]?.id || null,
      activeChannelId: mockChannels["s1"]?.[0]?.id || null,
    });
  },

  addServer: (server) => {
    set((s) => ({
      servers: [...s.servers, server],
      channels: { ...s.channels, [server.id]: [] },
      members: { ...s.members, [server.id]: [] },
    }));
  },

  addChannel: (channel) => {
    set((s) => {
      const existing = s.channels[channel.server_id] || [];
      return { channels: { ...s.channels, [channel.server_id]: [...existing, channel] } };
    });
  },

  deleteServer: (id) => {
    set((s) => ({
      servers: s.servers.filter((srv) => srv.id !== id),
      activeServerId: s.activeServerId === id ? (s.servers[0]?.id || null) : s.activeServerId,
    }));
  },
}));
