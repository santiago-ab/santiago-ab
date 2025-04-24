import { Module } from '@nestjs/common';
import { SocketService } from './socket.service';
import { SocketGateway } from './socket.gateway';
import { NotificationsModule } from '@/notifications/notifications.module';
import { AuthModule } from '@/auth/auth.module';

@Module({
  imports: [AuthModule, NotificationsModule],
  providers: [SocketGateway, SocketService],
})
export class SocketModule {}
