import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  const port = process.env.PORT ?? 3000;

  await app.listen(port);

  console.log(`🚀 Server is running on http://localhost:${port}`);
  console.log(`📊 Version: ${process.env.APP_VERSION || '1.0.0'}`);
  console.log(`📁 Dataset: ${process.env.DATASET_PATH || 'data/tickets.json'}`);
  console.log(`📝 Log file: ${process.env.LOG_FILE || 'logs/app.log'}`);
}
bootstrap();
