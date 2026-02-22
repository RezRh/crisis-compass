import { create } from "zustand";
import type { User } from "@/types/domain";
import { apiClient } from "@/services/api";
import { mockCurrentUser } from "@/services/mock-data";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  useMock: boolean;

  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loginMock: () => void;
  updateProfile: (data: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  useMock: true,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await apiClient.login(email, password);
      apiClient.setToken(res.access_token);
      set({ user: res.user, token: res.access_token, isAuthenticated: true, isLoading: false });
    } catch (e: any) {
      set({ error: e.message, isLoading: false });
    }
  },

  register: async (username, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await apiClient.register(username, email, password);
      apiClient.setToken(res.access_token);
      set({ user: res.user, token: res.access_token, isAuthenticated: true, isLoading: false });
    } catch (e: any) {
      set({ error: e.message, isLoading: false });
    }
  },

  logout: () => {
    apiClient.setToken(null);
    set({ user: null, token: null, isAuthenticated: false });
  },

  loginMock: () => {
    set({ user: mockCurrentUser, token: "mock-token", isAuthenticated: true, useMock: true });
  },

  updateProfile: (data) => {
    const { user } = get();
    if (user) {
      set({ user: { ...user, ...data } });
    }
  },
}));
