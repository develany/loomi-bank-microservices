import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app";
import { HttpExceptionFilter } from "./shared/filters/http-exception.filter";
import { LoggerService } from "./shared/services/logger.service";
import { ConfigService } from "./config/config.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const configService = app.get(ConfigService);
  const logger = app.get(LoggerService);
  logger.setContext("Bootstrap");

  app.useLogger(logger);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );
  app.useGlobalFilters(new HttpExceptionFilter(logger));

  // Setup Swagger
  if (!configService.isProduction) {
    const config = new DocumentBuilder()
      .setTitle("Transactions API")
      .setDescription("API for managing transactions")
      .setVersion("1.0")
      .addTag("transactions")
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api/docs", app, document);
  }

  const port = configService.port;
  await app.listen(port);
  logger.log(`Application is running on: http://localhost:${port}`);

  if (!configService.isProduction) {
    logger.log(
      `Swagger documentation is available at: http://localhost:${port}/api/docs`
    );
  }
}
bootstrap();
