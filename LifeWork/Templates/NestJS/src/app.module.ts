import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { UsersModule } from '@/users/users.module';
import { AuthModule } from '@/auth/auth.module';
import { NotificationsService } from '@/notifications/notifications.service';
import { NotificationsModule } from '@/notifications/notifications.module';
import { JwtConfigModule } from '@/jwt/jwt.module';
import { validationSchema } from 'env.validation';
import { SocketModule } from './socket/socket.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
    }),
    UsersModule,
    AuthModule,
    NotificationsModule,
    JwtConfigModule,
    SocketModule
  ],
  controllers: [AppController],
  providers: [AppService, NotificationsService],
})
export class AppModule {}
