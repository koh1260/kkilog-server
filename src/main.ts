import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import {
  WinstonModule,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';
import * as winston from 'winston';
import { HttpExceptionFilter } from './exception/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { LoggingInterceptor } from './common/interceptor/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({
          level: process.env.NODE_ENV === 'production' ? 'info' : 'silly',
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp(),
            nestWinstonModuleUtilities.format.nestLike('My-Blog', {
              prettyPrint: true,
            }),
          ),
        }),
      ],
    }),
  });

  app.useGlobalInterceptors(new LoggingInterceptor(new Logger()));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  // app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.useGlobalFilters(new HttpExceptionFilter(new Logger()));
  app.use(cookieParser());
  app.enableCors({
    origin: process.env.CORS_ORIGIN,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  console.log(process.env.NODE_ENV);

  const config = new DocumentBuilder()
    .setTitle('KKilog API')
    .setDescription('KKilog API 임미다.')
    .setVersion('1.0')
    .addTag('KKilog')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(8080);
}
void bootstrap();
