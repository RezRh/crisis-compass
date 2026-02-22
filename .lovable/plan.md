

# Discord-Inspired Chat Application — Frontend

A modern, Discord-inspired chat application frontend built with React, Zustand, and TypeScript, designed to connect to an external Rust backend API.

---

## 1. Layout & Navigation Shell

Build the core three-panel layout:
- **Server sidebar** (narrow icon strip on the far left) — shows server avatars, add-server button
- **Channel sidebar** (collapsible, second column) — shows server name, channel list grouped by category, user info at bottom
- **Main content area** — chat messages, header with channel info, message input

Dark theme by default with a polished, modern aesthetic.

---

## 2. Authentication Pages

- **Login page** — email/password form with modern styling
- **Register page** — username, email, password form
- Both wired to an API service layer (configurable backend URL) with mock fallback
- Auth state managed in Zustand, JWT token storage, protected route wrapper

---

## 3. Chat & Messaging UI

- **Message list** using virtualized scrolling (react-virtuoso) for performance
- Messages show avatar, username, timestamp, content, and edit/delete actions
- **Message input** with support for multi-line text
- Typing indicators area
- Message grouping by author/time

---

## 4. Server & Channel Management

- **Create server** dialog
- **Create channel** dialog (text channels)
- Server member list panel (toggleable on right side)
- Channel categories with collapsible groups

---

## 5. Settings Pages

- **User settings** — profile editing (username, avatar, email, password change)
- **Server settings** — server name, icon, delete server
- **Role management UI** — create/edit roles with permission toggles

---

## 6. State Management & API Layer

- **Zustand stores**: auth, servers, channels, messages, UI state
- **API service module** with configurable base URL, typed request/response interfaces matching the Rust backend domain model (User, Server, Channel, Message, Role, Permission)
- **WebSocket client hook** — connects to backend WS endpoint, dispatches incoming events to Zustand stores
- Mock data fallback when backend is unavailable

---

## 7. Type System & Domain Model

Shared TypeScript types mirroring the Rust core crate:
- `User`, `Server`, `Channel`, `Message`, `Role`, `Permission`
- `Event` union type (UserRegistered, MessageSent, etc.)
- `Command` types for outbound actions
- All API responses fully typed

