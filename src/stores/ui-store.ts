import { create } from "zustand";

type SettingsView = "user" | "server" | null;
type MainView = "servers" | "dms";

interface UIState {
  mainView: MainView;
  showMemberList: boolean;
  sidebarCollapsed: boolean;
  activeDM: string | null;
  showNotifications: boolean;
  settingsView: SettingsView;
  createServerOpen: boolean;
  createChannelOpen: boolean;
  showNewMessage: boolean;
  showSearch: boolean;

  setMainView: (view: MainView) => void;
  toggleMemberList: () => void;
  toggleSidebar: () => void;
  setActiveDM: (name: string | null) => void;
  setShowNotifications: (show: boolean) => void;
  openSettings: (view: SettingsView) => void;
  closeSettings: () => void;
  setCreateServerOpen: (open: boolean) => void;
  setCreateChannelOpen: (open: boolean) => void;
  setShowNewMessage: (show: boolean) => void;
  setShowSearch: (show: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  mainView: "servers",
  showMemberList: false,
  sidebarCollapsed: false,
  activeDM: null,
  showNotifications: false,
  settingsView: null,
  createServerOpen: false,
  createChannelOpen: false,
  showNewMessage: false,
  showSearch: false,

  setMainView: (view) => set({ mainView: view }),
  toggleMemberList: () => set((s) => ({ showMemberList: !s.showMemberList })),
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setActiveDM: (name) => set({ activeDM: name }),
  setShowNotifications: (show) => set({ showNotifications: show }),
  openSettings: (view) => set({ settingsView: view }),
  closeSettings: () => set({ settingsView: null }),
  setCreateServerOpen: (open) => set({ createServerOpen: open }),
  setCreateChannelOpen: (open) => set({ createChannelOpen: open }),
  setShowNewMessage: (show) => set({ showNewMessage: show }),
  setShowSearch: (show) => set({ showSearch: show }),
}));
