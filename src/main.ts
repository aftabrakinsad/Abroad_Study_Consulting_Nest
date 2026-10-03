import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // FRONTEND_URL may hold several comma-separated origins (e.g. prod + preview URLs)
  const origins = (process.env.FRONTEND_URL || 'http://localhost:3000')
    .split(',')
    .map((o) => o.trim());
  app.enableCors({ origin: origins });

  const port = process.env.PORT || 3001;
  await app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}
bootstrap();
