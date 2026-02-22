import type { User, Server, Channel, Message, ServerMember } from "@/types/domain";

export const mockCurrentUser: User = {
  id: "u1",
  username: "DemoUser",
  email: "demo@example.com",
  avatar_url: null,
  status: "online",
  created_at: new Date().toISOString(),
};

const otherUsers: User[] = [
  { id: "u2", username: "Alice", email: "alice@example.com", avatar_url: null, status: "online", created_at: new Date().toISOString() },
  { id: "u3", username: "Bob", email: "bob@example.com", avatar_url: null, status: "idle", created_at: new Date().toISOString() },
  { id: "u4", username: "Charlie", email: "charlie@example.com", avatar_url: null, status: "dnd", created_at: new Date().toISOString() },
  { id: "u5", username: "Diana", email: "diana@example.com", avatar_url: null, status: "offline", created_at: new Date().toISOString() },
];

export const mockServers: Server[] = [
  { id: "s1", name: "Rust Dev", icon_url: null, owner_id: "u1", created_at: new Date().toISOString() },
  { id: "s2", name: "Gaming Hub", icon_url: null, owner_id: "u2", created_at: new Date().toISOString() },
  { id: "s3", name: "Design Studio", icon_url: null, owner_id: "u1", created_at: new Date().toISOString() },
];

export const mockChannels: Record<string, Channel[]> = {
  s1: [
    { id: "c1", server_id: "s1", name: "general", category: "Text Channels", position: 0, created_at: new Date().toISOString() },
    { id: "c2", server_id: "s1", name: "help", category: "Text Channels", position: 1, created_at: new Date().toISOString() },
    { id: "c3", server_id: "s1", name: "announcements", category: "Info", position: 0, created_at: new Date().toISOString() },
  ],
  s2: [
    { id: "c4", server_id: "s2", name: "general", category: "Text Channels", position: 0, created_at: new Date().toISOString() },
    { id: "c5", server_id: "s2", name: "looking-for-group", category: "Text Channels", position: 1, created_at: new Date().toISOString() },
  ],
  s3: [
    { id: "c6", server_id: "s3", name: "general", category: "Text Channels", position: 0, created_at: new Date().toISOString() },
    { id: "c7", server_id: "s3", name: "feedback", category: "Text Channels", position: 1, created_at: new Date().toISOString() },
  ],
};

function generateMessages(channelId: string): Message[] {
  const allUsers = [mockCurrentUser, ...otherUsers];
  const messages: Message[] = [];
  const phrases = [
    "Hey everyone! 👋",
    "Has anyone tried the new Rust async traits?",
    "I just deployed my latest project",
    "Can someone review my PR?",
    "Great work on the release!",
    "Let me check that real quick",
    "That's a really interesting approach",
    "I think we should refactor that module",
    "Anyone up for a code review session?",
    "The docs need some updating",
    "Looks good to me! 🚀",
    "I'm running into a borrow checker issue",
  ];

  for (let i = 0; i < 25; i++) {
    const author = allUsers[i % allUsers.length];
    const minutesAgo = (25 - i) * 3;
    messages.push({
      id: `${channelId}-m${i}`,
      channel_id: channelId,
      author,
      content: phrases[i % phrases.length],
      edited_at: null,
      created_at: new Date(Date.now() - minutesAgo * 60000).toISOString(),
    });
  }
  return messages;
}

export const mockMessages: Record<string, Message[]> = {
  c1: generateMessages("c1"),
  c2: generateMessages("c2"),
  c3: generateMessages("c3"),
  c4: generateMessages("c4"),
  c5: generateMessages("c5"),
  c6: generateMessages("c6"),
  c7: generateMessages("c7"),
};

export const mockMembers: Record<string, ServerMember[]> = {
  s1: [mockCurrentUser, ...otherUsers].map((user) => ({
    user,
    roles: [],
    joined_at: new Date().toISOString(),
  })),
  s2: [mockCurrentUser, otherUsers[0], otherUsers[1]].map((user) => ({
    user,
    roles: [],
    joined_at: new Date().toISOString(),
  })),
  s3: [mockCurrentUser, otherUsers[2], otherUsers[3]].map((user) => ({
    user,
    roles: [],
    joined_at: new Date().toISOString(),
  })),
};
