import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';

@Injectable()
export class NotificationsService {
  private server: Server;
  private onlineUsers: Map<string, string> = new Map();

  setServer(server: Server) {
    this.server = server;
  }

  addUser(userId: string, socketId: string) {
    this.onlineUsers.set(userId, socketId);
  }

  removeUser(userId: string) {
    this.onlineUsers.delete(userId);
  }

  getOnlineUsers(): string[] {
    return Array.from(this.onlineUsers.keys());
  }

  sendToUser(userId: string, notification: any) {
    const socketId = this.onlineUsers.get(userId);
    if (socketId) {
      this.server.to(socketId).emit('notification', notification);
    }
  }

  broadcast(notification: any) {
    this.server.emit('notification', notification);
  }
}
