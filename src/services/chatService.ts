import { io, Socket } from 'socket.io-client';

class ChatService {
  private socket: Socket | null = null;

  connect() {
    if (this.socket?.connected) return this.socket;
    
    this.socket = io(window.location.origin);
    return this.socket;
  }

  getSocket() {
    return this.socket;
  }

  joinChat(sessionId: string, isAdmin: boolean = false) {
    this.socket?.emit('join_chat', { sessionId, isAdmin });
  }

  sendMessage(payload: {
    sessionId: string;
    sender: 'customer' | 'admin';
    message: string;
    name?: string;
    phone?: string;
  }) {
    this.socket?.emit('send_message', payload);
  }

  async getSessions() {
    try {
      const res = await fetch('/api/chat/sessions');
      return await res.json();
    } catch (err) {
      return [];
    }
  }

  async getMessages(sessionId: string) {
    try {
      const res = await fetch(`/api/chat/messages/${sessionId}`);
      return await res.json();
    } catch (err) {
      return [];
    }
  }

  async resetUnread(sessionId: string) {
    try {
      await fetch(`/api/chat/reset-unread/${sessionId}`, { method: 'POST' });
    } catch (err) {
      // ignore
    }
  }
}

export const chatService = new ChatService();
