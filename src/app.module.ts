import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
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

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`${__dirname}/config/env/.${process.env.NODE_ENV}.env`],
      load: [jwtConfig],
      isGlobal: true,
      validationSchema: validationSchema,
    }),
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      synchronize: false,
      entities: [__dirname + '/modules/**/entities/*.entity{.ts,.js}'],
      migrationsRun: true,
      migrations: [__dirname + '/migrations/*{.ts,.js}'],
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
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService],
})
export class AppModule {}
