import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PostsModule } from './modules/posts/posts.module';
import { ExceptionModule } from './common/filters/exception-filter.module';
import { CategorysModule } from './modules/categorys/categorys.module';
import { CommentsModule } from './modules/comments/comments.module';
import jwtConfig from './config/jwtConfig';
import { validationSchema } from './config/validationSchema';
import { FileModule } from './file/file.module';
import * as winston from 'winston';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import { IntercepterModule } from './common/interceptors/intercepter.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`${__dirname}/config/env/.${process.env.NODE_ENV}.env`],
      load: [jwtConfig],
      isGlobal: true,
      validationSchema: validationSchema,
    }),
    WinstonModule.forRoot({
      level: process.env.NODE_ENV === 'production' ? 'info' : 'silly',
      transports: [
        new winston.transports.Console({
          format:
            process.env.NODE_ENV === 'production'
              ? winston.format.simple()
              : winston.format.combine(
                  winston.format.timestamp(),
                  winston.format.ms(),
                  nestWinstonModuleUtilities.format.nestLike('Kkilog', {
                    colors: true,
                    prettyPrint: true,
                  }),
                ),
        }),
      ],
    }),
    AuthModule,
    UsersModule,
    PostsModule,
    CategorysModule,
    CommentsModule,
    FileModule,
    ExceptionModule,
    IntercepterModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService],
})
export class AppModule {}
