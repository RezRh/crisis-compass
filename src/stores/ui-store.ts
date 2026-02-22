import { create } from "zustand";

type SettingsView = "user" | "server" | null;

interface UIState {
  showMemberList: boolean;
  settingsView: SettingsView;
  createServerOpen: boolean;
  createChannelOpen: boolean;

  toggleMemberList: () => void;
  openSettings: (view: SettingsView) => void;
  closeSettings: () => void;
  setCreateServerOpen: (open: boolean) => void;
  setCreateChannelOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  showMemberList: false,
  settingsView: null,
  createServerOpen: false,
  createChannelOpen: false,

  toggleMemberList: () => set((s) => ({ showMemberList: !s.showMemberList })),
  openSettings: (view) => set({ settingsView: view }),
  closeSettings: () => set({ settingsView: null }),
  setCreateServerOpen: (open) => set({ createServerOpen: open }),
  setCreateChannelOpen: (open) => set({ createChannelOpen: open }),
}));
