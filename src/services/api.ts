import type {
  User, Server, Channel, Message, Role, ServerMember,
  AuthResponse, ApiResponse,
} from "@/types/domain";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

class ApiClient {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };
    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    const res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
    if (!res.ok) {
      const body = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(body.error || res.statusText);
    }
    return res.json();
  }

  // Auth
  async login(email: string, password: string): Promise<AuthResponse> {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async register(username: string, email: string, password: string): Promise<AuthResponse> {
    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ username, email, password }),
    });
  }

  // Servers
  async getServers(): Promise<Server[]> {
    return this.request("/servers");
  }

  async createServer(name: string): Promise<Server> {
    return this.request("/servers", {
      method: "POST",
      body: JSON.stringify({ name }),
    });
  }

  async updateServer(id: string, data: Partial<Server>): Promise<Server> {
    return this.request(`/servers/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async deleteServer(id: string): Promise<void> {
    return this.request(`/servers/${id}`, { method: "DELETE" });
  }

  async getServerMembers(serverId: string): Promise<ServerMember[]> {
    return this.request(`/servers/${serverId}/members`);
  }

  // Channels
  async getChannels(serverId: string): Promise<Channel[]> {
    return this.request(`/servers/${serverId}/channels`);
  }

  async createChannel(serverId: string, name: string, category?: string): Promise<Channel> {
    return this.request(`/servers/${serverId}/channels`, {
      method: "POST",
      body: JSON.stringify({ name, category }),
    });
  }

  // Messages
  async getMessages(channelId: string, before?: string): Promise<Message[]> {
    const q = before ? `?before=${before}` : "";
    return this.request(`/channels/${channelId}/messages${q}`);
  }

  async sendMessage(channelId: string, content: string): Promise<Message> {
    return this.request(`/channels/${channelId}/messages`, {
      method: "POST",
      body: JSON.stringify({ content }),
    });
  }

  async editMessage(messageId: string, content: string): Promise<Message> {
    return this.request(`/messages/${messageId}`, {
      method: "PATCH",
      body: JSON.stringify({ content }),
    });
  }

  async deleteMessage(messageId: string): Promise<void> {
    return this.request(`/messages/${messageId}`, { method: "DELETE" });
  }

  // Roles
  async getRoles(serverId: string): Promise<Role[]> {
    return this.request(`/servers/${serverId}/roles`);
  }

  async createRole(serverId: string, data: Partial<Role>): Promise<Role> {
    return this.request(`/servers/${serverId}/roles`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // User
  async updateProfile(data: Partial<User>): Promise<User> {
    return this.request("/users/me", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }
}

export const apiClient = new ApiClient();
