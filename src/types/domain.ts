// Domain types mirroring Rust core crate

export interface User {
  id: string;
  username: string;
  email: string;
  avatar_url: string | null;
  status: UserStatus;
  created_at: string;
}

export type UserStatus = "online" | "idle" | "dnd" | "offline";

export interface Server {
  id: string;
  name: string;
  icon_url: string | null;
  owner_id: string;
  created_at: string;
}

export interface Channel {
  id: string;
  server_id: string;
  name: string;
  category: string | null;
  position: number;
  created_at: string;
}

export interface Message {
  id: string;
  channel_id: string;
  author: User;
  content: string;
  edited_at: string | null;
  created_at: string;
}

export interface Role {
  id: string;
  server_id: string;
  name: string;
  color: string;
  permissions: Permission[];
  position: number;
}

export type Permission =
  | "ManageServer"
  | "ManageChannels"
  | "ManageRoles"
  | "ManageMessages"
  | "SendMessages"
  | "ReadMessages"
  | "KickMembers"
  | "BanMembers";

export interface ServerMember {
  user: User;
  roles: Role[];
  joined_at: string;
}

// Events from backend
export type ServerEvent =
  | { type: "UserRegistered"; user: User }
  | { type: "UserLoggedIn"; user: User; token: string }
  | { type: "ServerCreated"; server: Server }
  | { type: "ChannelCreated"; channel: Channel }
  | { type: "MessageSent"; message: Message }
  | { type: "MessageEdited"; message: Message }
  | { type: "MessageDeleted"; message_id: string; channel_id: string }
  | { type: "MemberJoinedServer"; server_id: string; member: ServerMember }
  | { type: "TypingStarted"; channel_id: string; user: User };

// Commands to backend
export type Command =
  | { type: "Register"; username: string; email: string; password: string }
  | { type: "Login"; email: string; password: string }
  | { type: "CreateServer"; name: string }
  | { type: "CreateChannel"; server_id: string; name: string; category?: string }
  | { type: "SendMessage"; channel_id: string; content: string }
  | { type: "EditMessage"; message_id: string; content: string }
  | { type: "DeleteMessage"; message_id: string }
  | { type: "StartTyping"; channel_id: string };

// API response wrappers
export interface ApiResponse<T> {
  data: T;
  error: string | null;
}

export interface AuthResponse {
  user: User;
  access_token: string;
  refresh_token: string;
}
