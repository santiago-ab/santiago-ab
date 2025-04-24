import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger: Logger = new Logger('Main');
  logger.log('Initializing server...');
  const app = await NestFactory.create(AppModule);
  logger.log('Modules imported!');
  const config = app.get(ConfigService);
  logger.log('Reading configuration...');
  const PORT = config.get('PORT') ?? 3000;
  await app.listen(PORT);
  logger.log(`Server running on PORT: ${PORT}`);
}
bootstrap();
