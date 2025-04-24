import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from '@/auth/auth.service';
import { AuthController } from '@/auth/auth.controller';
import { UsersModule } from '@/users/users.module';
import { JwtConfigModule } from '@/jwt/jwt.module';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtConfigModule
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [JwtConfigModule],
})
export class AuthModule {}
