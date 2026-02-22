import { create } from "zustand";
import type { Message } from "@/types/domain";
import { mockMessages } from "@/services/mock-data";

interface MessageState {
  messages: Record<string, Message[]>;
  typingUsers: Record<string, string[]>; // channelId -> usernames

  loadMockMessages: () => void;
  addMessage: (msg: Message) => void;
  editMessage: (id: string, channelId: string, content: string) => void;
  deleteMessage: (id: string, channelId: string) => void;
  getChannelMessages: (channelId: string) => Message[];
  setTyping: (channelId: string, username: string) => void;
  clearTyping: (channelId: string, username: string) => void;
}

export const useMessageStore = create<MessageState>((set, get) => ({
  messages: {},
  typingUsers: {},

  loadMockMessages: () => {
    set({ messages: mockMessages });
  },

  addMessage: (msg) => {
    set((s) => {
      const existing = s.messages[msg.channel_id] || [];
      return { messages: { ...s.messages, [msg.channel_id]: [...existing, msg] } };
    });
  },

  editMessage: (id, channelId, content) => {
    set((s) => {
      const msgs = (s.messages[channelId] || []).map((m) =>
        m.id === id ? { ...m, content, edited_at: new Date().toISOString() } : m
      );
      return { messages: { ...s.messages, [channelId]: msgs } };
    });
  },

  deleteMessage: (id, channelId) => {
    set((s) => {
      const msgs = (s.messages[channelId] || []).filter((m) => m.id !== id);
      return { messages: { ...s.messages, [channelId]: msgs } };
    });
  },

  getChannelMessages: (channelId) => {
    return get().messages[channelId] || [];
  },

  setTyping: (channelId, username) => {
    set((s) => {
      const current = s.typingUsers[channelId] || [];
      if (current.includes(username)) return s;
      return { typingUsers: { ...s.typingUsers, [channelId]: [...current, username] } };
    });
    // Auto-clear after 3s
    setTimeout(() => get().clearTyping(channelId, username), 3000);
  },

  clearTyping: (channelId, username) => {
    set((s) => {
      const current = (s.typingUsers[channelId] || []).filter((u) => u !== username);
      return { typingUsers: { ...s.typingUsers, [channelId]: current } };
    });
  },
}));
