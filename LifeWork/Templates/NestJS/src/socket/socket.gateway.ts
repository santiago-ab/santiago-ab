import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { WsJwtGuard } from '@/jwt/jwt-auth.guard';
import { NotificationsService } from '../notifications/notifications.service';

@UseGuards(WsJwtGuard)
@WebSocketGateway({ cors: true })
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger: Logger = new Logger('SocketGateway');
  private onlineUsers = new Map<string, string>();
  private server: Server;
  constructor(private notificationsService: NotificationsService) {}

  afterInit(_server: Server) {
    this.server = _server;
    this.notificationsService.setServer(_server);
    this.broadcastOnlineUsers();
    this.logger.log('WebSocket Gateway Initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    const user = client.data.user;

    this.notificationsService.addUser(user.userId, client.id);
    this.onlineUsers.set(user.userId, client.id);

    this.logger.log(`User ${user.username} connected (ID: ${client.id})`);
    this.broadcastOnlineUsers();
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    const user = client.data.user;
    if (user) {
      this.notificationsService.removeUser(user.userId);
      this.onlineUsers.delete(user.userId);
      this.logger.log(`User ${user.username} disconnected`);
      this.broadcastOnlineUsers();
    }
  }

  broadcastOnlineUsers() {
    const users = Array.from(this.onlineUsers.keys());
    this.server.emit('online-users', users);
  }

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() data: { sender: string; message: string },
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.log(`Message from ${data.sender}: ${data.message}`);
    client.broadcast.emit('message', data); // Send to everyone except sender
  }
}
