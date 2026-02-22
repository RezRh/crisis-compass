import { create } from "zustand";

type SettingsView = "user" | "server" | null;
type MainView = "servers" | "dms";

interface UIState {
  mainView: MainView;
  showMemberList: boolean;
  settingsView: SettingsView;
  createServerOpen: boolean;
  createChannelOpen: boolean;

  setMainView: (view: MainView) => void;
  toggleMemberList: () => void;
  openSettings: (view: SettingsView) => void;
  closeSettings: () => void;
  setCreateServerOpen: (open: boolean) => void;
  setCreateChannelOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  mainView: "servers",
  showMemberList: false,
  settingsView: null,
  createServerOpen: false,
  createChannelOpen: false,

  setMainView: (view) => set({ mainView: view }),
  toggleMemberList: () => set((s) => ({ showMemberList: !s.showMemberList })),
  openSettings: (view) => set({ settingsView: view }),
  closeSettings: () => set({ settingsView: null }),
  setCreateServerOpen: (open) => set({ createServerOpen: open }),
  setCreateChannelOpen: (open) => set({ createChannelOpen: open }),
}));
