import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from '@/app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('healthcheck')
  getProfile(@Req() req: Request) {
    return "Services upp and running!";
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  getGuard(): string {
    return this.appService.getHello();
  }
}
